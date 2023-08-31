// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod folder;
mod menu;

use menu::{get_menu, menu_event_handle};

fn main() {
    let menu = get_menu();

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(menu_event_handle)
        .invoke_handler(tauri::generate_handler![folder::show_in_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
