import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import './ImageBulkUpload.css';

interface UploadResult {
  success: number;
  failed: number;
  errors: Array<{ fileName: string; reason: string }>;
}

export default function ImageBulkUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.endsWith('.jpg')
    );

    setFiles(droppedFiles);
    setUploadResult(null);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.endsWith('.jpg')
      );
      setFiles(selectedFiles);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Por favor selecciona archivos primero');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const fullUrl = `${apiUrl}/api/cloudinary/bulk-upload`;

      console.log('[ImageBulkUpload] VITE_API_URL:', import.meta.env.VITE_API_URL);
      console.log('[ImageBulkUpload] API URL usada:', apiUrl);
      console.log('[ImageBulkUpload] URL completa:', fullUrl);
      console.log('[ImageBulkUpload] Enviando', files.length, 'archivos');

      const response = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la carga: ${response.statusText}`);
      }

      const result: UploadResult = await response.json();
      setUploadResult(result);

      if (result.success > 0) {
        // Si todo fue exitoso, limpiar los archivos
        if (result.failed === 0) {
          setFiles([]);
        }
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error al subir las imágenes. Revisa la consola para más detalles.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-bulk-upload">
      <h2>Carga Masiva de Imágenes</h2>
      <p className="instructions">
        Arrastra archivos JPG o selecciónalos manualmente. Los nombres deben tener el formato:
        <strong> IM-modelo.jpg</strong>, <strong>ES-modelo.jpg</strong>, o <strong>PL-modelo.jpg</strong>
      </p>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,image/jpeg"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {files.length === 0 ? (
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p>Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="file-info">Solo archivos JPG</p>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="upload-icon">✓</div>
            <p className="files-count">{files.length} archivo(s) seleccionado(s)</p>
            <p className="file-info">Haz clic para cambiar la selección</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Archivos seleccionados ({files.length}):</h3>
          <div className="file-list-container">
            {files.slice(0, 10).map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
            {files.length > 10 && (
              <div className="file-item more-files">
                ... y {files.length - 10} archivo(s) más
              </div>
            )}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="action-buttons">
          <button
            className="btn-upload"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Subiendo...' : `Subir ${files.length} imagen(es)`}
          </button>
          <button
            className="btn-clear"
            onClick={handleClear}
            disabled={uploading}
          >
            Limpiar
          </button>
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="spinner"></div>
          <p>Subiendo imágenes... Esto puede tomar varios minutos.</p>
        </div>
      )}

      {uploadResult && (
        <div className="upload-result">
          <h3>Resultado de la carga</h3>
          <div className="result-summary">
            <div className="result-item success">
              <span className="result-label">Exitosas:</span>
              <span className="result-value">{uploadResult.success}</span>
            </div>
            <div className="result-item failed">
              <span className="result-label">Fallidas:</span>
              <span className="result-value">{uploadResult.failed}</span>
            </div>
          </div>

          {uploadResult.errors.length > 0 && (
            <div className="error-list">
              <h4>Errores ({uploadResult.errors.length}):</h4>
              <div className="error-list-container">
                {uploadResult.errors.map((error, index) => (
                  <div key={index} className="error-item">
                    <span className="error-file">{error.fileName}:</span>
                    <span className="error-reason">{error.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
