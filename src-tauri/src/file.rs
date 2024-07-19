use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::io::{self, BufRead};
use std::fs::File;



#[derive(Serialize)]
pub struct FileNode {
    name: String,
    path: String,
    is_directory: bool,
    is_file: bool,
    children: Option<Vec<FileNode>>,
}

#[derive(Serialize)]
pub struct SearchResult {
    path: String,
    name: String,
    match_lines: Vec<String>,
}


#[tauri::command]
pub fn read_dir(path: String) -> Result<FileNode, String> {
    fn build_tree(path: PathBuf) -> Result<FileNode, String> {
        let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
        let is_directory = metadata.is_dir();
        let is_file = metadata.is_file();
        let name = path
            .file_name()
            .ok_or("Invalid file name")?
            .to_string_lossy()
            .into_owned();
        let path_str = path.to_string_lossy().into_owned();

        let children = if is_directory {
            let entries = fs::read_dir(&path).map_err(|e| e.to_string())?;
            let mut children = vec![];
            for entry in entries {
                let entry = entry.map_err(|e| e.to_string())?;
                let child_path = entry.path();
                let child_node = build_tree(child_path)?;
                children.push(child_node);
            }
            Some(children)
        } else {
            None
        };

        Ok(FileNode {
            name,
            path: path_str,
            is_directory,
            is_file,
            children,
        })
    }

    let path_buf = PathBuf::from(path);
    build_tree(path_buf)
}


#[tauri::command]
pub fn search_keyword_in_dir(keyword: String, path: String) -> Result<Vec<SearchResult>, String> {
    fn search_in_file(keyword: &str, file_path: &PathBuf) -> Result<Vec<String>, io::Error> {
        let file = File::open(file_path)?;
        let reader = io::BufReader::new(file);
        let mut match_lines = Vec::new();
        let keyword_lower = keyword.to_lowercase();

        for (_index, line) in reader.lines().enumerate() {
            let line = line?;
            if line.to_lowercase().contains(&keyword_lower) {
                match_lines.push(line.to_string());
            }
        }

        Ok(match_lines)
    }

    fn search_in_dir(keyword: &str, path: &PathBuf) -> Result<Vec<SearchResult>, String> {
        let mut results = Vec::new();
        let entries = fs::read_dir(path).map_err(|e| e.to_string())?;

        for entry in entries {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();
            if path.is_dir() {
                let mut sub_results = search_in_dir(keyword, &path)?;
                results.append(&mut sub_results);
            } else if path.extension().and_then(|s| s.to_str()) == Some("md") {
                let match_lines = search_in_file(keyword, &path).map_err(|e| e.to_string())?;
                if !match_lines.is_empty() {
                    results.push(SearchResult {
                        path: path.to_string_lossy().into_owned(),
                        name: path
                            .file_name()
                            .ok_or("Invalid file name")?
                            .to_string_lossy()
                            .into_owned(),
                        match_lines,
                    });
                }
            }
        }

        Ok(results)
    }

    let path_buf = PathBuf::from(path);
    search_in_dir(&keyword, &path_buf)
}

