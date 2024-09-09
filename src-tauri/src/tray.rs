use rand::Rng;
use tauri::{
    image::Image,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, Runtime,
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

fn create_window<R: Runtime>(app: &tauri::AppHandle<R>, label: String, path: String) {
    // 创建新的 webview 窗口
    let builder = tauri::WebviewWindowBuilder::new(app, label, tauri::WebviewUrl::App(path.into()))
        .title("MDX editor")
        .inner_size(1200.0, 780.0)
        .center()
        .resizable(true)
        .visible(false)
        .decorations(true);
    #[cfg(target_os = "macos")]
    {
        builder
            .hidden_title(true)
            .title_bar_style(tauri::TitleBarStyle::Overlay)
            .build()
            .unwrap();
    }

    #[cfg(not(target_os = "macos"))]
    {
        builder.decorations(true).build().unwrap();
    }
}

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    // create menu

    let main_window_i = MenuItem::with_id(app, "main", "Main window", true, None::<String>)?;
    let new_window_i = MenuItem::with_id(app, "new", "New window", true, None::<String>)?;
    let quit_i = PredefinedMenuItem::quit(app, Some("Quit"))?;
    let separator_i = PredefinedMenuItem::separator(app)?;

    let menu = Menu::with_items(app, &[&main_window_i, &new_window_i, &separator_i, &quit_i])?;

    let _ = TrayIconBuilder::with_id("tray")
        .menu(&menu)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "new" => {
                // 生成一个随机字符串
                let random_name = generate_random_string(10);

                // create new webview window
                create_window(app, random_name, '/'.to_string())
            }
            "main" => {
                // 显示main 窗口
                let app_handle = app.app_handle();
                match app_handle.get_webview_window("main") {
                    Some(window) => {
                        window.show().unwrap();
                        window.unminimize().unwrap();
                        window.set_focus().unwrap();
                    }
                    None => create_window(app, "main".to_string(), '/'.to_string()),
                }
            }
            "quit" => app.exit(0),
            _ => {}
        })
        .tooltip("MDX editor")
        .icon(if cfg!(target_os = "macos") {
            Image::from_bytes(include_bytes!("../icons/appleTrayIcon.png"))
        } else {
            Image::from_bytes(include_bytes!("../icons/128x128.png"))
        }?)
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                id: _,
                position,
                rect: _,
                button,
                button_state: _,
            } => match button {
                MouseButton::Left {} => {
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
