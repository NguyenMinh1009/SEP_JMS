using Microsoft.AspNetCore.Http;
using SEP_JMS.Common.Constants;
using SEP_JMS.Model.Models.ExtensionModels;
using System.IO.Compression;

namespace SEP_JMS.Common.Utils
{
    public class FileUtility
    {
        private static readonly object _locker = new();

        public static string GetFolderPath(string container, string folder)
        {
            lock (_locker)
            {
                var directory = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory);
                var parentFolder = Path.Combine(directory?.FullName ?? AppDomain.CurrentDomain.BaseDirectory, container);
                if (!Directory.Exists(parentFolder)) _ = Directory.CreateDirectory(parentFolder);

                var commentFolder = Path.Combine(parentFolder, folder);
                if (!Directory.Exists(commentFolder)) Directory.CreateDirectory(commentFolder);
                return commentFolder;
            }
        }

        public static async Task<FileItem> SaveFile(string container, string folder, IFormFile file)
        {
            var commentFolder = GetFolderPath(container, folder);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            using var fileStream = new FileStream(Path.Combine(commentFolder, fileName), FileMode.Create);
            await file.CopyToAsync(fileStream);
            return new FileItem
            {
                FileName = fileName,
                OriginalName = file.FileName,
                MimeType = file.ContentType
            };
        }

        public static async Task<FileItem> SaveOneFile(string container, string fileName, IFormFile file)
        {
            var commentFolder = GetFolderPath(container, "");
            fileName = fileName + Path.GetExtension(file.FileName);
            using var fileStream = new FileStream(Path.Combine(commentFolder, fileName), FileMode.Create);
            await file.CopyToAsync(fileStream);
            return new FileItem
            {
                FileName = fileName,
                OriginalName = file.FileName,
                MimeType = file.ContentType
            };
        }

        public static void RemoveOldFiles(string folderPath, List<FileItem> keepingFiles)
        {
            if (!Directory.Exists(folderPath)) return;
            var existingFiles = Directory.GetFiles(folderPath);
            foreach (var existingFile in existingFiles)
            {
                if (keepingFiles.Any(keep => Path.GetFileName(existingFile) == keep.FileName)) continue;
                else File.Delete(existingFile);
            }
        }

        public static string GetFilePath(string folderPath, FileItem fileInfo)
        {
            try
            {
                var existingFiles = Directory.GetFiles(folderPath);
                var existingFilePath = string.Empty;
                foreach (var existingFile in existingFiles)
                {
                    if (Path.GetFileName(existingFile) == fileInfo.FileName)
                    {
                        existingFilePath = existingFile;
                        break;
                    }
                }
                if (!string.IsNullOrEmpty(existingFilePath) && File.Exists(existingFilePath)) return existingFilePath;
                return string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string ZipFile(string filePath)
        {
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(filePath);
            var fileName = Path.GetFileName(filePath);

            var folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ApiConstants.ExportFolder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            var zipPath = Path.Combine(folderPath, $"{fileNameWithoutExt}.zip");
            using FileStream zipToCreate = new(zipPath, FileMode.Create);
            using ZipArchive archive = new(zipToCreate, ZipArchiveMode.Create);
            archive.CreateEntryFromFile(filePath, fileName);
            zipToCreate.Flush();
            return zipPath;
        }
    }
}
