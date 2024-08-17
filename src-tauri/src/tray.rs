use rand::Rng;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Emitter, Runtime,
};

fn generate_random_string(length: usize) -> String {
    let mut rng = rand::thread_rng();
    let characters: Vec<char> = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        .chars()
        .collect();
    let mut result = String::new();

    for _ in 0..length {
        let random_index = rng.gen_range(0..characters.len());
        result.push(characters[random_index]);
    }

    result
}

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    // create menu

    let new_window_i = MenuItem::with_id(app, "new", "New window", true, None::<String>)?;
    let quit_i = PredefinedMenuItem::quit(app, Some("Quit"))?;
    let separator_i = PredefinedMenuItem::separator(app)?;

    let menu = Menu::with_items(app, &[&new_window_i, &separator_i, &quit_i])?;

    let _ = TrayIconBuilder::with_id("tray")
        .menu(&menu)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "new" => {
                // 生成一个随机字符串
                let random_name = generate_random_string(10);

                // create new webview window
                tauri::WebviewWindowBuilder::new(
                    app,
                    random_name,
                    tauri::WebviewUrl::App("/".into()),
                )
                .title("MDX editor")
                .hidden_title(true)
                .title_bar_style(tauri::TitleBarStyle::Overlay)
                .inner_size(1200.0, 780.0)
                .center()
                .visible(false)
                .build()
                .unwrap();
            }
            "quit" => app.exit(0),
            _ => {}
        })
        .tooltip("mdx")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                id: _,
                position,
                rect: _,
                button,
                button_state: _,
            } => match button {
                MouseButton::Left {} => {
                    // let windows = tray.app_handle().webview_windows();
                    // for (key, value) in windows {
                    //     if key == "login" || key == "main" {
                    //         value.show().unwrap();
                    //         value.unminimize().unwrap();
                    //         value.set_focus().unwrap();
                    //     }
                    // }

                    tray.app_handle().emit("tray_menu", position).unwrap();
                }
                MouseButton::Right {} => {}
                _ => {}
            },
            TrayIconEvent::Enter {
                id: _,
                position,
                rect: _,
            } => {
                tray.app_handle().emit("tray_enter", position).unwrap();
            }
            TrayIconEvent::Leave {
                id: _,
                position,
                rect: _,
            } => {
                tray.app_handle().emit("tray_leave", position).unwrap();
            }
            _ => {}
        })
        .build(app);
    Ok(())
}
