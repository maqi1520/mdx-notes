// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod folder;
mod menu;

use menu::{get_menu, menu_event_handle};

use tauri_plugin_window_state::Builder as windowStatePlugin;

fn main() {
    let menu = get_menu();

    tauri::Builder::default()
        .plugin(windowStatePlugin::default().build())
        .menu(menu)
        .on_menu_event(menu_event_handle)
        .invoke_handler(tauri::generate_handler![folder::show_in_folder])
        .on_window_event(|event| {
            if let tauri::WindowEvent::Focused(focus) = event.event() {
                //println!("Focused: {}", focus);
                if *focus {
                    let js_code = "webViewFocus();";
                    event.window().eval(js_code).unwrap();
                }
            }

            if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
                #[cfg(target_os = "macos")]
                {
                    event.window().minimize().unwrap();
                }

                #[cfg(not(target_os = "macos"))]
                event.window().close().unwrap();

                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
