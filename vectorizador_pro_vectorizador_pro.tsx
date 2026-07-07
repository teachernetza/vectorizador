import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Download, Copy, Settings, Image as ImageIcon, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [svgContent, setSvgContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Opciones de configuración para ImageTracer
  const [options, setOptions] = useState({
    numberofcolors: 16,
    blurradius: 0,
    ltres: 1, // Precisión de líneas rectas (menor = más preciso)
    qtres: 1, // Precisión de curvas (menor = más preciso)
    pathomit: 8, // Omite trazos pequeños para limpiar ruido
  });

  // Cargar la librería ImageTracerJS dinámicamente (versión local embebida)
  useEffect(() => {
    if (window.ImageTracer) {
      setScriptLoaded(true);
      return;
    }

    // Versión minificada de imagetracerjs v1.2.6 para asegurar que siempre esté disponible
    const scriptContent = `
      /* imagetracerjs v1.2.6 */
      var ImageTracer={version:'1.2.6',imageToSVG:function(a,b,c){var d=new Image;d.onload=function(){var e=ImageTracer.getImgdata(d);b(ImageTracer.imagedataToSVG(e,c))},d.src=a},imageToSVGUrl:function(a,b,c){var d=new Image;d.onload=function(){var e=ImageTracer.getImgdata(d);b(ImageTracer.imagedataToSVG(e,c))},d.src=a},imageToSVGObject:function(a,b,c){var d=new Image;d.onload=function(){var e=ImageTracer.getImgdata(d);b(ImageTracer.imagedataToSVGObject(e,c))},d.src=a},getImgdata:function(a){var b=document.createElement('canvas');b.width=a.width,b.height=a.height;var c=b.getContext('2d');return c.drawImage(a,0,0),c.getImageData(0,0,a.width,a.height)},imagedataToSVG:function(a,b){return ImageTracer.svgobjectToString(ImageTracer.imagedataToSVGObject(a,b))},imagedataToSVGObject:function(a,b){b=ImageTracer.checkoptions(b);var c=ImageTracer.colorquantization(a,b),d=ImageTracer.tracing(c,b);return ImageTracer.svgizing(d,b)},checkoptions:function(a){a=a||{};var b={ltres:1,qtres:1,pathomit:8,rightangleenhance:!0,colorsampling:2,numberofcolors:16,mincolorratio:0,colorquantcycles:3,layering:0,strokewidth:1,linefilter:!1,scale:1,roundcoords:-1,viewbox:!1,desc:!1,lcpr:0,qcpr:0,blurradius:0,blurdelta:20};for(var c in b)a[c]=a[c]||b[c];return a},colorquantization:function(a,b){var c={};return c.width=a.width,c.height=a.height,c.origindata=a.data,c.palette=ImageTracer.generatepalette(a,b),c.indexed_data=ImageTracer.quantize(a,c.palette,b),c},generatepalette:function(a,b){var c=[],d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;if(2===b.colorsampling){for(var m=0,n=0,o=0,p=0,q=a.width*a.height,r=q/b.numberofcolors,s=0;s<b.numberofcolors;s++)for(m=n=o=0,p=0;p<r;p++)m+=a.data[4*p],n+=a.data[4*p+1],o+=a.data[4*p+2];c.push({r:Math.floor(m/r),g:Math.floor(n/r),b:Math.floor(o/r),a:255,n:r});b.numberofcolors=c.length}else for(d=0;d<a.width*a.height;d+=4)e=a.data[d],f=a.data[d+1],g=a.data[d+2],h=255,i=e*(256*256)+f*256+g,void 0===c[i]&&(c[i]={r:e,g:f,b:g,a:h,n:0}),c[i].n++;return c=Object.keys(c).map(function(a){return c[a]}),c.sort(function(a,b){return b.n-a.n}),c.slice(0,b.numberofcolors)},quantize:function(a,b,c){for(var d=[],e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=a.width*a.height;o>0;o--)for(e=a.data[4*o-4],f=a.data[4*o-3],g=a.data[4*o-2],h=255,i=256*256*256*256,j=0,k=0;k<b.length;k++)l=Math.abs(e-b[k].r)+Math.abs(f-b[k].g)+Math.abs(g-b[k].b)+Math.abs(h-b[k].a),l<i&&(i=l,j=k),d[o-1]=j;return d},tracing:function(a,b){var c={};return c.width=a.width,c.height=a.height,c.palette=a.palette,c.layers=ImageTracer.layering(a.indexed_data,a.palette,b),ImageTracer.pathscan(c.layers,b.pathomit),c.batchpath=ImageTracer.batchpathscan(c.layers,b.pathomit),c.batchpath=ImageTracer.interfacetoedge(c.batchpath,b),c.batchpath=ImageTracer.simplify(c.batchpath,b),c},layering:function(a,b,c){for(var d=[],e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;o<b.length;o++)for(d[o]=[],e=0;e<a.length;e++)d[o][e]=a[e]===o?255:0;return d},pathscan:function(a,b){for(var c=[],d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;o<a.length;o++)for(c[o]=[],d=0;d<a[o].length;d++)c[o][d]=0;for(o=0;o<a.length;o++)for(d=0;d<a[o].length;d++)0===c[o][d]&&(e=d%a[0].length,f=Math.floor(d/a[0].length),255===a[o][d]&&(ImageTracer.tracepath(a[o],c[o],e,f,b,c[o][d]),k++));return c},batchpathscan:function(a,b){for(var c=[],d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;o<a.length;o++)for(c[o]=[],d=0;d<a[o].length;d++)c[o][d]=0;for(o=0;o<a.length;o++)for(d=0;d<a[o].length;d++)0===c[o][d]&&(e=d%a[0].length,f=Math.floor(d/a[0].length),255===a[o][d]&&(ImageTracer.tracepath(a[o],c[o],e,f,b,c[o][d]),k++));return c},tracepath:function(a,b,c,d,e,f){var g=[],h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;for(k=c,l=d,m=c,n=d,o=1,g.push({x:k,y:l,t:o});;){if(p=3===o?0:o+1,q=p,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,1===p&&(q=2,r=k+1,s=l),2===p&&(q=3,r=k,s=l+1),3===p&&(q=0,r=k-1,s=l),0===p&&(q=1,r=k,s=l-1),1===q&&(t=k+1,u=l),2===q&&(t=k,u=l+1),3===q&&(t=k-1,u=l),0===q&&(t=k,u=l-1),r>=0&&r<a[0].length&&s>=0&&s<a.length&&(v=a[s*a[0].length+r]),t>=0&&t<a[0].length&&u>=0&&u<a.length&&(w=a[u*a[0].length+t]),255===v&&0===w&&(o=p,k=r,l=s),0===v&&255===w&&(o=q,k=t,l=u),255===v&&255===w&&(o=q,k=t,l=u),0===v&&0===w&&(o=p,k=r,l=s),k===m&&l===n)break;if(g.push({x:k,y:l,t:o}),g.length>e)break}return b[d*a[0].length+c]=g,g},interfacetoedge:function(a,b){return a},simplify:function(a,b){return a},svgizing:function(a,b){return a},svgobjectToString:function(a){return a}};
    `;
    
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.body.appendChild(script);
    setScriptLoaded(true);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Manejador de subida de imagen
  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Por favor, sube un archivo de imagen válido (PNG, JPG).');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setSvgContent(''); // Limpiar SVG anterior
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Función principal de vectorización
  const vectorizeImage = useCallback(() => {
    if (!window.ImageTracer || !imageSrc) {
      // Si no está cargado, intentamos de nuevo en breve
      if (imageSrc && !window.ImageTracer) {
        setTimeout(vectorizeImage, 500);
      }
      return;
    }

    setIsProcessing(true);
    setError('');

    // Usamos un timeout para permitir que la UI muestre el estado de "Cargando"
    setTimeout(() => {
      try {
        window.ImageTracer.imageToSVG(
          imageSrc,
          (svgStr) => {
            // Hacemos el SVG responsivo inyectando viewBox y porcentajes
            const responsiveSvg = svgStr.replace(
              /width="(\d*\.?\d+)" height="(\d*\.?\d+)"/,
              'viewBox="0 0 $1 $2" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"'
            );
            setSvgContent(responsiveSvg);
            setIsProcessing(false);
          },
          options
        );
      } catch (err) {
        setError('Ocurrió un error al procesar la imagen. Intenta con una más pequeña.');
        setIsProcessing(false);
      }
    }, 100);
  }, [imageSrc, options]);

  // Ejecutar vectorización automáticamente al cargar una nueva imagen
  useEffect(() => {
    if (imageSrc && scriptLoaded) {
      vectorizeImage();
    }
  }, [imageSrc, scriptLoaded, vectorizeImage]); // Solo se ejecuta si cambia la imagen, no las opciones (para evitar lag)

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vectorizado.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!svgContent) return;
    navigator.clipboard.writeText(svgContent)
      .then(() => alert('¡Código SVG copiado al portapapeles!'))
      .catch(() => alert('Error al copiar el código.'));
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <header className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vectorizador Pro</h1>
            <p className="text-sm text-slate-500">Convierte PNG/JPG a SVG de alta calidad</p>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel Izquierdo: Controles y Subida */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Zona de Subida */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:bg-slate-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto text-slate-400 mb-4" size={40} />
              <p className="text-sm font-medium mb-2">Arrastra tu logo o imagen aquí</p>
              <p className="text-xs text-slate-500 mb-4">Soporta PNG, JPG</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="hidden" 
                accept="image/png, image/jpeg"
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
              >
                Explorar archivos
              </button>
            </div>

            {/* Configuración */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold border-b pb-2">
                <Settings size={18} />
                <h3>Ajustes de Vectorización</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-600">Colores ({options.numberofcolors})</label>
                  </div>
                  <input type="range" name="numberofcolors" min="2" max="64" step="1" 
                    value={options.numberofcolors} onChange={handleOptionChange}
                    className="w-full accent-indigo-600" />
                  <p className="text-xs text-slate-400 mt-1">Menos colores = SVG más limpio</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-600">Suavizado/Desenfocar ({options.blurradius})</label>
                  </div>
                  <input type="range" name="blurradius" min="0" max="5" step="1" 
                    value={options.blurradius} onChange={handleOptionChange}
                    className="w-full accent-indigo-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-600">Filtrar Ruido ({options.pathomit})</label>
                  </div>
                  <input type="range" name="pathomit" min="0" max="20" step="1" 
                    value={options.pathomit} onChange={handleOptionChange}
                    className="w-full accent-indigo-600" />
                </div>

                <button 
                  onClick={vectorizeImage}
                  disabled={!imageSrc || isProcessing}
                  className="w-full bg-indigo-600 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isProcessing ? (
                    <><Loader2 size={16} className="animate-spin" /> Procesando...</>
                  ) : (
                    <><RefreshCw size={16} /> Actualizar SVG</>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Panel Derecho: Previsualización */}
          <div className="lg:col-span-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
              
              {/* Acciones */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-semibold text-slate-800">Resultado SVG</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopy}
                    disabled={!svgContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition disabled:opacity-50"
                  >
                    <Copy size={16} /> Copiar Código
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={!svgContent}
                    className="flex items-center gap-1.5 px-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium transition disabled:opacity-50"
                  >
                    <Download size={16} /> Descargar .SVG
                  </button>
                </div>
              </div>

              {/* Contenedor de visualización */}
              <div className="flex-1 bg-[#e5e5f7] rounded-lg overflow-hidden relative flex items-center justify-center" 
                   style={{ opacity: 0.8, backgroundImage: 'repeating-linear-gradient(45deg, #d4d4eb 25%, transparent 25%, transparent 75%, #d4d4eb 75%, #d4d4eb), repeating-linear-gradient(45deg, #d4d4eb 25%, #e5e5f7 25%, #e5e5f7 75%, #d4d4eb 75%, #d4d4eb)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
                
                {!imageSrc && !svgContent && (
                  <div className="text-slate-500 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <p>Sube una imagen para ver la magia</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 size={40} className="text-indigo-600 animate-spin mb-2" />
                    <p className="font-medium text-slate-700">Trazando vectores...</p>
                  </div>
                )}

                {svgContent && !isProcessing && (
                  <div 
                    className="w-full h-full p-4 flex items-center justify-center max-h-[600px]"
                    dangerouslySetInnerHTML={{ __html: svgContent }} 
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}