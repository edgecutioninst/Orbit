interface TemplateItem {
  filename: string;
  fileExtension: string;
  content: string;
  folderName?: string;
  items?: TemplateItem[];
}

interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;

export function transformToWebContainerFormat(template: { folderName: string; items: TemplateItem[] }): WebContainerFileSystem {
  function processItem(item: TemplateItem): WebContainerFile | WebContainerDirectory {
    if (item.folderName && item.items) {
      // This is a directory
      const directoryContents: WebContainerFileSystem = {};

      item.items.forEach(subItem => {
        let key = "";
        if (subItem.folderName) {
          key = subItem.folderName;
        } else {
          // ✅ Safely handles files with or without extensions
          key = subItem.fileExtension
            ? `${subItem.filename}.${subItem.fileExtension}`
            : subItem.filename;
        }
        directoryContents[key] = processItem(subItem);
      });

      return {
        directory: directoryContents
      };
    } else {
      // This is a file
      return {
        file: {
          contents: item.content || ""
        }
      };
    }
  }

  const result: WebContainerFileSystem = {};

  template.items.forEach(item => {
    let key = "";
    if (item.folderName) {
      key = item.folderName;
    } else {
      // ✅ Same safe check for root level items
      key = item.fileExtension
        ? `${item.filename}.${item.fileExtension}`
        : item.filename;
    }
    result[key] = processItem(item);
  });

  return result;
}