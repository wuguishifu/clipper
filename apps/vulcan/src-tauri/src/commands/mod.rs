use std::path::Path;

use serde::Deserialize;
use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;

fn resource_path(app: &AppHandle, relative: &str) -> Result<String, String> {
    app.path()
        .resource_dir()
        .map(|p| p.join(relative).to_string_lossy().into_owned())
        .map_err(|e| e.to_string())
}

// ---------------------------------------------------------------------------
// extract_audio
// Extracts a mono 16 kHz WAV from the input video using the bundled ffmpeg.
// Places the WAV next to the source file (same name, .wav extension).
// Returns the path to the output WAV file.
// ---------------------------------------------------------------------------
#[tauri::command]
pub async fn extract_audio(app: AppHandle, input_path: String) -> Result<String, String> {
    let input = Path::new(&input_path);
    let output_path = input.with_extension("wav");
    let output_str = output_path
        .to_str()
        .ok_or("input path is not valid UTF-8")?
        .to_string();

    let output = app
        .shell()
        .sidecar("ffmpeg")
        .map_err(|e| e.to_string())?
        .args([
            "-y",
            "-i",
            &input_path,
            "-vn",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            "-ac",
            "1",
            &output_str,
        ])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).into_owned();
        return Err(format!("ffmpeg extract_audio failed: {stderr}"));
    }

    Ok(output_str)
}

// ---------------------------------------------------------------------------
// Whisper JSON output format (subset we care about)
// ---------------------------------------------------------------------------
#[derive(Deserialize)]
struct WhisperOffsets {
    from: u64, // milliseconds
    to: u64,   // milliseconds
}

#[derive(Deserialize)]
struct WhisperSegment {
    offsets: WhisperOffsets,
    text: String,
}

#[derive(Deserialize)]
struct WhisperOutput {
    transcription: Vec<WhisperSegment>,
}

// ---------------------------------------------------------------------------
// transcribe_audio
// Runs whisper-cli on the WAV file, reads the JSON output, and returns the
// transcript as a JSON string in the format Claude expects:
// [{"speaker":"host","start":0.0,"end":5.2,"text":"Hello world"}]
// ---------------------------------------------------------------------------
#[tauri::command]
pub async fn transcribe_audio(app: AppHandle, audio_path: String) -> Result<String, String> {
    let model_path = resource_path(&app, "ggml-base.en.bin")?;

    let audio = Path::new(&audio_path);
    let output_base = audio
        .with_extension("")
        .to_str()
        .ok_or("audio path is not valid UTF-8")?
        .to_string();

    let output = app
        .shell()
        .sidecar("whisper-cli")
        .map_err(|e| e.to_string())?
        .args([
            "-m",
            &model_path,
            "-f",
            &audio_path,
            "-oj",
            "-of",
            &output_base,
            "-np",
            "-t",
            "8",
            "--no-gpu",
            "--prompt",
            "[laughter], [laughing], lol, haha",
        ])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).into_owned();
        return Err(format!("whisper-cli failed: {stderr}"));
    }

    let json_path = format!("{output_base}.json");
    let raw = std::fs::read_to_string(&json_path)
        .map_err(|e| format!("failed to read whisper output {json_path}: {e}"))?;

    let whisper: WhisperOutput =
        serde_json::from_str(&raw).map_err(|e| format!("failed to parse whisper JSON: {e}"))?;

    let segments: Vec<serde_json::Value> = whisper
        .transcription
        .into_iter()
        .map(|seg| {
            serde_json::json!({
                "speaker": "host",
                "start": seg.offsets.from as f64 / 1000.0,
                "end": seg.offsets.to as f64 / 1000.0,
                "text": seg.text.trim(),
            })
        })
        .collect();

    serde_json::to_string(&segments).map_err(|e| e.to_string())
}

// ---------------------------------------------------------------------------
// trim_clip
// Trims the input video to [start_seconds, end_seconds] using stream copy.
// ---------------------------------------------------------------------------
#[tauri::command]
pub async fn trim_clip(
    app: AppHandle,
    input_path: String,
    start_seconds: f64,
    end_seconds: f64,
    output_path: String,
) -> Result<(), String> {
    let start = start_seconds.to_string();
    let end = end_seconds.to_string();

    let output = app
        .shell()
        .sidecar("ffmpeg")
        .map_err(|e| e.to_string())?
        .args([
            "-y",
            "-i",
            &input_path,
            "-ss",
            &start,
            "-to",
            &end,
            "-c",
            "copy",
            &output_path,
        ])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr).into_owned();
        return Err(format!("ffmpeg trim_clip failed: {stderr}"));
    }

    Ok(())
}
