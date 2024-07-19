// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


mod folder;
mod file;

use tauri::WindowEvent;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
    
        .on_window_event(|window, event| {
            match event {
                
                // WindowEvent::Focused(true) => {
                //     window.emit("window-focused", {}).unwrap();
                // }
                WindowEvent::CloseRequested { api, .. } => {
                    #[cfg(target_os = "macos")]
                    {
                        window.minimize().unwrap();
                    }

                    #[cfg(not(target_os = "macos"))]
                    {
                        window.close().unwrap();
                    }

                    api.prevent_close();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![file::read_dir, folder::show_in_folder, file::search_keyword_in_dir, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
