import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// PACIENTE DE DEMOSTRACIÓN INICIAL
// ==========================================
const INITIAL_PATIENTS = [
  {
    id: "1",
    fechaRegistro: "2026-05-10",
    nombre: "SANDRO SAMUEL CACERES RENTERIA",
    fechaNacimiento: "1988-04-21",
    edad: "38",
    sexo: "MASCULINO",
    cedulaIdentidad: "5698421",
    carnetDiscapacidad: "NO",
    direccion: "CANDUA AVENIDA RENE BARRIENTOSS",
    telefono: "63359333",
    ocupacion: "GANADERO",
    medicacionActual: "NOS REFIERE QUE NO PUEDE CAMINAR DE BUENA FORMA. DOLOR A LA MOVILIZACION ACTIVA Y PASIVA. ANTECEDENTES DE GOLPE CON UN TORO EN FEBRERO. ACTUALMENTE CON MEDICACION.",
    alergias: "NO",
    operaciones: "NO",
    app: "NO",
    // Examen Físico
    fc: "61",
    fr: "20",
    ta: "100/70",
    temperatura: "36",
    so2: "96",
    cabeza: "CRANEO NORMOCONFIGURADO VIGIL CONCIENTE NO SIGNOS MENINGEOS NI FOCALIZACION NEUROLOGICA LENGUAJE SIN ALTERACION, PACIENTE ORIENTADO EN TIEMPO ESPACIO PERSONA COLABORA CON EL INTERROGATORIO CON LENGUAJE CLARO COHERENTE",
    torax: "NORMOCONFIGURADO MV CONSERVADO EN AMBOS CAMPOS PULMONARES NO SE AUSCULTAN ESTERTORES",
    abdomen: "GLOBOSO DEPRESIBLE RHA PRESENTES NORMOACTIVOS DOLOR LEVE EN HEMIABDOMEN INFERIOR, PARTE POSTERIOR DOLOR EN REGION LUMBAR SOBRE TOO A LOS ESFUERZOS, SE NOTA DEFORMIDAD VERTEBRAL",
    extremidades: "MIEMBROS INFERIORES TONO Y TROFISMO CONSERVADO SENSIBILIDAD TACTIL Y DOLORROSA SIN ALTERACION FUERZA MUSCULAR SIN ALTERACION ARTICULACION DE LAS RODILLAS DERECHA NO DOLOROSO A LA PALPACION NO CRUJIDO ARTICULAR A LA MOVILIZACION NO EDEMA LEVE DOLOR A LA FLEXOEXTENSION MAYORMENTE A LA EXTENSION MARCHA CON LIMITACION POR DOLOR LA RODILLA IZQUIERDA SIN ALTERACION",
    // Diagnóstico & Tratamiento
    diagnostico: "M23.8 - OTROS TRASTORNOS INTERNOS DE LA RODILLA (LESION DE LIGAMENTOS COLATERALES/CRUZADOS)",
    tratamiento: "FISIOTERAPIA",
    complementarios: "ESTUDIOS RADIOGRÁFICOS DE RODILLA IZQUIERDA Y COLUMNA LUMBAR. EVALUACIÓN REUMATOLÓGICA SUGERIDA.",
    // Notas de Seguimiento
    seguimientos: [
      { id: "s1", fecha: "2026-05-10", nota: "Inicia primera sesión de fisioterapia analgésica. Tolerancia adecuada al ejercicio terapéutico pasivo." },
      { id: "s2", fecha: "2026-05-24", nota: "Se observa leve aumento del rango articular a la flexión de la rodilla izquierda. Dolor lumbar persiste tras esfuerzos físicos medianos." }
    ]
  }
];

// --- FUNCIONES AUXILIARES PARA EL FORMATEO DE FECHAS LOCALES ---
const formatLongDate = (dateStr) => {
  if (!dateStr) return "No registrado";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return dateStr;
};

const formatShortDate = (dateStr) => {
  if (!dateStr) return "S/D";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  return dateStr;
};

// Componente de Icono SVG personalizado
const SVGIcon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    heart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
    activity: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    thermometer: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6a3 3 0 016 0v13M9 19a3 3 0 11-6 0M9 19h6m0 0a3 3 0 116 0" />
    ),
    gauge: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    ),
    printer: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4H7v4a2 2 0 002 2zM9 9h6V5a2 2 0 00-2-2H11a2 2 0 00-2 2v4z" />
    ),
    edit: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
    save: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    ),
    download: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    ),
    upload: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    folder: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    )
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || <path d="M12 2v20M2 12h20" />}
    </svg>
  );
};

export default function App() {
  // --- ESTADOS PRINCIPALES ---
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('hc_rehab_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [selectedPatientId, setSelectedPatientId] = useState(INITIAL_PATIENTS[0] ? INITIAL_PATIENTS[0].id : null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [activeTab, setActiveTab] = useState("personales");
  const [formData, setFormData] = useState(null);
  
  const [newFollowUpDate, setNewFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFollowUpText, setNewFollowUpText] = useState("");

  // --- BASE DE DATOS CIE-10 (JSON) ---
  const [cieDatabase, setCieDatabase] = useState([]);
  const [loadingCie, setLoadingCie] = useState(true);
  const [showCieSuggestions, setShowCieSuggestions] = useState(false);

  const [modalAlert, setModalAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: "" });

  const fileInputRef = useRef(null);

  // Carga asincrónica del archivo JSON desde public/data/cie10.json
  useEffect(() => {
    fetch('/data/cie10.json')
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró el archivo cie10.json");
        return res.json();
      })
      .then((data) => {
        setCieDatabase(data);
        setLoadingCie(false);
      })
      .catch((err) => {
        console.error("Error al cargar cie10.json:", err);
        setLoadingCie(false);
      });
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    localStorage.setItem('hc_rehab_patients', JSON.stringify(patients));
  }, [patients]);

  const showAlert = (title, message, type = "success") => {
    setModalAlert({ title, message, type });
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0] || null;

  const filteredPatients = patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.diagnostico && p.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.cedulaIdentidad && p.cedulaIdentidad.includes(searchTerm))
  );

  // --- FILTRO DE SUGERENCIAS CIE-10 EN TIEMPO REAL (MEJORADO) ---
  const getCieSuggestions = () => {
    if (!formData || !formData.diagnostico) return [];
    
    // Limpiamos y separamos por espacios para permitir búsquedas flexibles (ej: "colera", "A00")
    const query = formData.diagnostico.toLowerCase().trim();
    if (query.length === 0) return [];

    return cieDatabase.filter(item => {
      const codeMatch = item.code.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      return codeMatch || descMatch;
    }).slice(0, 20); // Muestra hasta 20 coincidencias fluidas
  };

  const cieSuggestions = getCieSuggestions();

  const handlePrint = () => {
    window.print();
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CRI_Monteagudo_BackUp_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showAlert("Respaldo JSON", "La copia de seguridad JSON se descargó con éxito.", "success");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          setPatients(parsed);
          if (parsed.length > 0) {
            setSelectedPatientId(parsed[0].id);
          }
          showAlert("Importación Exitosa", `Se han cargado ${parsed.length} historias clínicas al sistema.`, "success");
        } else {
          showAlert("Archivo Inválido", "El formato del archivo cargado no es una base de datos de pacientes válida.", "error");
        }
      } catch (err) {
        showAlert("Error al Cargar", "No se pudo descifrar el archivo JSON.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportExcel = () => {
    if (!window.XLSX) {
      showAlert("Cargando Motor", "El procesador de Excel se está cargando de fondo, inténtelo de nuevo en 3 segundos.", "info");
      return;
    }

    try {
      const flatData = patients.map(p => ({
        "Fecha de Registro": p.fechaRegistro || "S/R",
        "Nombre Completo": p.nombre,
        "Fecha de Nacimiento": p.fechaNacimiento || "S/D",
        "Edad": p.edad,
        "Sexo": p.sexo,
        "Cédula de Identidad": p.cedulaIdentidad,
        "Carnet de Discapacidad": p.carnetDiscapacidad,
        "Dirección": p.direccion,
        "Teléfono": p.telefono,
        "Ocupación": p.ocupacion,
        "Motivo / Medicación Actual": p.medicacionActual,
        "Alergias": p.alergias,
        "Operaciones": p.operaciones,
        "Antecedentes Personales (APP)": p.app,
        "FC (lpm)": p.fc,
        "FR (rpm)": p.fr,
        "Presión Arterial": p.ta,
        "Temperatura (°C)": p.temperatura,
        "Saturación O2 (%)": p.so2,
        "Examen Físico Cabeza": p.cabeza,
        "Examen Físico Tórax": p.torax,
        "Examen Físico Abdomen": p.abdomen,
        "Examen Físico Extremidades": p.extremidades,
        "Diagnóstico Principal (CIE-10)": p.diagnostico,
        "Esquema de Tratamiento": p.tratamiento,
        "Estudios Complementarios": p.complementarios,
        "Nro de Evoluciones": p.seguimientos ? p.seguimientos.length : 0
      }));

      const ws = window.XLSX.utils.json_to_sheet(flatData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "Historias Clínicas");
      
      const maxW = flatData.reduce((acc, row) => {
        Object.keys(row).forEach((key, i) => {
          const v = row[key] ? row[key].toString() : "";
          acc[i] = Math.max(acc[i] || 12, v.length + 3, key.length + 3);
        });
        return acc;
      }, []);
      ws['!cols'] = maxW.map(w => ({ wh: w }));

      window.XLSX.writeFile(wb, `Fichas_Medicas_CRI_Monteagudo_${new Date().toISOString().split('T')[0]}.xlsx`);
      showAlert("Excel Descargado", "Todas las historias clínicas se han descargado con éxito.", "success");
    } catch (error) {
      showAlert("Error al Exportar", "Ocurrió un error inesperado al generar el archivo Excel.", "error");
    }
  };

  const handleStartCreate = () => {
    setFormData({
      fechaRegistro: new Date().toISOString().split('T')[0],
      nombre: "",
      fechaNacimiento: "",
      edad: "",
      sexo: "MASCULINO",
      cedulaIdentidad: "",
      carnetDiscapacidad: "NO",
      direccion: "",
      telefono: "",
      ocupacion: "",
      medicacionActual: "",
      alergias: "NO",
      operaciones: "NO",
      app: "NO",
      fc: "",
      fr: "",
      ta: "",
      temperatura: "",
      so2: "",
      cabeza: "",
      torax: "",
      abdomen: "",
      extremidades: "",
      diagnostico: "",
      tratamiento: "",
      complementarios: "",
      seguimientos: []
    });
    setIsCreating(true);
    setIsEditing(false);
    setShowCieSuggestions(false);
  };

  const handleStartEdit = () => {
    if (!selectedPatient) return;
    setFormData({ 
      ...selectedPatient,
      fechaRegistro: selectedPatient.fechaRegistro || new Date().toISOString().split('T')[0]
    });
    setIsEditing(true);
    setIsCreating(false);
    setShowCieSuggestions(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === "fechaNacimiento" && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        updated.edad = isNaN(age) ? "" : age.toString();
      }
      return updated;
    });

    if (name === "diagnostico") {
      setShowCieSuggestions(true);
    }
  };

  const handleSelectCie = (cieItem) => {
    setFormData(prev => ({
      ...prev,
      diagnostico: `${cieItem.code} - ${cieItem.description}`
    }));
    setShowCieSuggestions(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      showAlert("Error de Validación", "El nombre del paciente es obligatorio.", "error");
      return;
    }

    if (isCreating) {
      const newPatient = {
        ...formData,
        id: Date.now().toString(),
        seguimientos: formData.seguimientos || []
      };
      setPatients(prev => [newPatient, ...prev]);
      setSelectedPatientId(newPatient.id);
      setIsCreating(false);
      showAlert("Paciente Registrado", `La historia clínica de ${newPatient.nombre} ha sido creada con éxito.`, "success");
    } else if (isEditing) {
      setPatients(prev => prev.map(p => p.id === formData.id ? { ...formData } : p));
      setIsEditing(false);
      showAlert("Registro Actualizado", "Los cambios han sido guardados perfectamente.", "success");
    }
  };

  const triggerDeleteConfirm = (id, nombre) => {
    setDeleteConfirm({ show: true, id, name: nombre });
  };

  const executeDeletion = () => {
    const targetId = deleteConfirm.id;
    const updatedList = patients.filter(p => p.id !== targetId);
    setPatients(updatedList);
    if (updatedList.length > 0) {
      setSelectedPatientId(updatedList[0].id);
    } else {
      setSelectedPatientId(null);
    }
    setDeleteConfirm({ show: false, id: null, name: "" });
    showAlert("Paciente Eliminado", "La ficha médica fue eliminada del sistema.", "info");
  };

  const handleAddFollowUp = (e) => {
    e.preventDefault();
    if (!newFollowUpText.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      fecha: newFollowUpDate,
      nota: newFollowUpText
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          seguimientos: [newNote, ...(p.seguimientos || [])]
        };
      }
      return p;
    }));

    setNewFollowUpText("");
    showAlert("Seguimiento Añadido", "Se agregó una nueva evolución médica al paciente.", "success");
  };

  const handleDeleteFollowUp = (patientId, noteId) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          seguimientos: p.seguimientos.filter(s => s.id !== noteId)
        };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <header className="bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-800 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
              <svg className="w-8 h-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10.5V20a2 2 0 01-2 2H7a2 2 0 01-2-2v-9.5m14 0V9a2 2 0 00-2-2h-3M5 10.5V9a2 2 0 012-2h3m7 1.5V3a1 1 0 00-1-1H9a1 1 0 00-1 1v4.5m11 2H5m11-1H8" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">CENTRO DE REHABILITACIÓN INTEGRAL MONTEAGUDO</h1>
              <p className="text-xs text-cyan-100 font-medium">SISTEMA INTEGRAL DE HISTORIAS CLÍNICAS MÉDICAS</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportData} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={handleImportClick}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-white/20"
              title="Importar base de datos JSON"
            >
              <SVGIcon name="upload" className="w-4 h-4" />
              <span>Importar</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-white/20"
              title="Exportar respaldo JSON"
            >
              <SVGIcon name="download" className="w-4 h-4" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md"
              title="Exportar a Excel"
            >
              <SVGIcon name="save" className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        <section className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 font-semibold tracking-wider block uppercase">Historias de Pacientes</span>
              <span className="text-2xl font-bold text-teal-700">{patients.length}</span>
              <span className="text-[10px] text-emerald-600 block font-semibold">● Base de Datos Conectada</span>
            </div>
            <button 
              onClick={handleStartCreate}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-cyan-600/10 transition transform active:scale-95"
            >
              <SVGIcon name="plus" className="w-4 h-4" />
              <span>Nueva Historia</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Búsqueda rápida</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <SVGIcon name="search" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Nombre, Diagnóstico o C.I."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col min-h-[400px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Historial Clínico</h2>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {filteredPatients.length}
              </span>
            </div>
            
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[50vh] lg:max-h-[60vh] flex-1">
              {filteredPatients.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <SVGIcon name="folder" className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No se encontraron pacientes.</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      setSelectedPatientId(patient.id);
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className={`p-4 cursor-pointer transition flex justify-between items-start ${
                      selectedPatientId === patient.id 
                        ? 'bg-gradient-to-r from-teal-50/50 to-cyan-50/20 border-l-4 border-teal-600' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-800 text-sm leading-snug uppercase">
                        {patient.nombre}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>C.I. {patient.cedulaIdentidad || "S/N"}</span>
                        <span>•</span>
                        <span>{patient.edad} años</span>
                        <span>•</span>
                        <span className="capitalize">{patient.sexo ? patient.sexo.toLowerCase() : ""}</span>
                      </div>
                      {patient.diagnostico && (
                        <p className="text-xs text-teal-700 font-medium line-clamp-1 italic mt-1">
                          {patient.diagnostico}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDeleteConfirm(patient.id, patient.nombre);
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition"
                      title="Eliminar historia clínica"
                    >
                      <SVGIcon name="trash" className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-8 flex flex-col space-y-4">
          {isCreating || isEditing ? (
            <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-cyan-800 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">
                    {isCreating ? "📝 Nueva Historia Clínica" : `✏️ Editando: ${formData.nombre}`}
                  </h2>
                  <p className="text-xs text-cyan-100">Por favor, rellene los campos correspondientes</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-500/20"
                  >
                    Guardar Ficha
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest border-b border-teal-100 pb-2">
                    1. Datos Personales del Paciente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-teal-600 mb-1 block">Fecha de Registro *</label>
                      <input
                        type="date"
                        name="fechaRegistro"
                        required
                        value={formData.fechaRegistro}
                        onChange={handleFormChange}
                        className="w-full bg-teal-50/50 border border-teal-200/60 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold text-teal-950 transition"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Nombre Completo *</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Sexo</label>
                      <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      >
                        <option value="MASCULINO">MASCULINO</option>
                        <option value="FEMENINO">FEMENINO</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Edad (Años)</label>
                      <input
                        type="number"
                        name="edad"
                        value={formData.edad}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Cédula de Identidad (C.I.)</label>
                      <input
                        type="text"
                        name="cedulaIdentidad"
                        value={formData.cedulaIdentidad}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Carnet Discapacidad</label>
                      <input
                        type="text"
                        name="carnetDiscapacidad"
                        value={formData.carnetDiscapacidad}
                        onChange={handleFormChange}
                        placeholder="NO / Sí (Grado %)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Ocupación</label>
                      <input
                        type="text"
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Dirección Domiciliaria</label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest border-b border-teal-100 pb-2">
                    2. Clínica, Antecedentes & Alergias
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Motivo de consulta / Medicación Actual / Accidentes</label>
                      <textarea
                        name="medicacionActual"
                        rows="3"
                        value={formData.medicacionActual}
                        onChange={handleFormChange}
                        placeholder="Ej: Caídas, traumatismos previos, medicación recetada recientemente..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Alergias Conocidas</label>
                      <input
                        type="text"
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Cirugías / Operaciones Previas</label>
                      <input
                        type="text"
                        name="operaciones"
                        value={formData.operaciones}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Antecedentes Personales Patológicos (APP)</label>
                      <input
                        type="text"
                        name="app"
                        value={formData.app}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest border-b border-teal-100 pb-2">
                    3. Examen Físico & Signos Vitales
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Frec. Cardíaca (FC)</label>
                      <input
                        type="text"
                        name="fc"
                        placeholder="e.g. 72 lpm"
                        value={formData.fc}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Frec. Resp. (FR)</label>
                      <input
                        type="text"
                        name="fr"
                        placeholder="e.g. 18 rpm"
                        value={formData.fr}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Tensión Art. (TA)</label>
                      <input
                        type="text"
                        name="ta"
                        placeholder="e.g. 120/80"
                        value={formData.ta}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Temperatura (°C)</label>
                      <input
                        type="text"
                        name="temperatura"
                        placeholder="e.g. 36.5"
                        value={formData.temperatura}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Saturación (SO2 %)</label>
                      <input
                        type="text"
                        name="so2"
                        placeholder="e.g. 98"
                        value={formData.so2}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Evaluación de Cabeza</label>
                      <textarea
                        name="cabeza"
                        rows="2"
                        value={formData.cabeza}
                        onChange={handleFormChange}
                        placeholder="Craneo, pupilas, mucosas, reflejos..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Evaluación de Tórax</label>
                      <textarea
                        name="torax"
                        rows="2"
                        value={formData.torax}
                        onChange={handleFormChange}
                        placeholder="Campos pulmonares, ruidos cardiacos..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Evaluación de Abdomen</label>
                      <textarea
                        name="abdomen"
                        rows="2"
                        value={formData.abdomen}
                        onChange={handleFormChange}
                        placeholder="Simetría, ruidos hidroaéreos, dolores específicos..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Evaluación de Extremidades (Foco rehabilitación)</label>
                      <textarea
                        name="extremidades"
                        rows="3"
                        value={formData.extremidades}
                        onChange={handleFormChange}
                        placeholder="Miembros superiores/inferiores, arcos de movimiento, fuerza muscular, reflejos tendinosos..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest border-b border-teal-100 pb-2">
                    4. Diagnóstico, Tratamiento y Exámenes Complementarios
                  </h3>
                  <div className="space-y-3">
                    
                    {/* DIAGNÓSTICO PRINCIPAL CON AUTOCOMPLETADO CIE-10 EN TIEMPO REAL */}
                    <div className="relative">
                      <label className="text-xs font-semibold text-teal-700 mb-1 flex justify-between items-center">
                        <span>Diagnóstico Principal (CIE-10 / Descripción) *</span>
                        {loadingCie ? (
                          <span className="text-[10px] text-amber-600 font-normal">Cargando catálogo CIE-10...</span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-normal">Catálogo activo ({cieDatabase.length} códigos)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="diagnostico"
                        required
                        value={formData.diagnostico}
                        onChange={handleFormChange}
                        onFocus={() => setShowCieSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCieSuggestions(false), 250)}
                        placeholder={loadingCie ? "Cargando base CIE-10..." : "Escriba código (ej: A00, M17) o descripción..."}
                        autoComplete="off"
                        className="w-full bg-teal-50/50 border border-teal-200/60 rounded-xl px-3 py-2.5 text-sm font-semibold text-teal-950 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                      
                      {/* Dropdown flotante con sugerencias inteligentes */}
                      {showCieSuggestions && cieSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-2xl shadow-xl mt-1.5 max-h-60 overflow-y-auto divide-y divide-slate-100">
                          {cieSuggestions.map((item) => (
                            <button
                              key={item.code}
                              type="button"
                              onClick={() => handleSelectCie(item)}
                              className="w-full text-left px-4 py-2.5 text-xs hover:bg-teal-50 transition flex items-start space-x-2.5"
                            >
                              <span className="font-black text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
                                {item.code}
                              </span>
                              <span className="text-slate-700 uppercase font-semibold leading-relaxed">
                                {item.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Esquema de Tratamiento Indicado</label>
                      <textarea
                        name="tratamiento"
                        rows="3"
                        value={formData.tratamiento}
                        onChange={handleFormChange}
                        placeholder="Fisioterapia, analgésicos, pautas ergonómicas..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">Exámenes Complementarios y Notas Adicionales</label>
                      <textarea
                        name="complementarios"
                        rows="2"
                        value={formData.complementarios}
                        onChange={handleFormChange}
                        placeholder="Radiografías, ecografías, interconsultas necesarias..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-teal-700/10 transition"
                >
                  Confirmar y Guardar
                </button>
              </div>
            </form>
          ) : selectedPatient ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
              <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">
                      Historia Clínica Activa
                    </span>
                    {selectedPatient.fechaRegistro && (
                      <span className="bg-white/10 text-cyan-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <SVGIcon name="calendar" className="w-3.5 h-3.5" />
                        <span>Apertura: {formatShortDate(selectedPatient.fechaRegistro)}</span>
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-black tracking-tight uppercase leading-snug">
                    {selectedPatient.nombre}
                  </h2>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300">
                    <span className="flex items-center space-x-1">
                      <SVGIcon name="user" className="w-3.5 h-3.5 text-teal-400" />
                      <span>C.I: {selectedPatient.cedulaIdentidad || "S/N"}</span>
                    </span>
                    <span>•</span>
                    <span>Edad: {selectedPatient.edad} años</span>
                    <span>•</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold">
                      {selectedPatient.sexo}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 self-stretch md:self-auto justify-end">
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition border border-white/10"
                  >
                    <SVGIcon name="printer" className="w-4 h-4" />
                    <span>Imprimir Ficha</span>
                  </button>
                  <button
                    onClick={handleStartEdit}
                    className="flex items-center space-x-1.5 bg-teal-500 hover:bg-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-teal-500/20"
                  >
                    <SVGIcon name="edit" className="w-4 h-4" />
                    <span>Editar Registro</span>
                  </button>
                </div>
              </div>

              <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
                {[
                  { id: "personales", label: "📋 Datos Personales" },
                  { id: "clinica", label: "🩺 Examen Físico" },
                  { id: "diagnostico", label: "📝 Dx y Tratamiento" },
                  { id: "seguimientos", label: "⏱️ Evolución / Seguimiento" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition uppercase tracking-wider text-center ${
                      activeTab === tab.id
                        ? "bg-white text-teal-700 shadow-sm border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 flex-1 overflow-y-auto max-h-[60vh]">
                {activeTab === "personales" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="border-b border-slate-50 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Fecha de Registro</span>
                        <span className="text-sm font-bold text-teal-800">
                          {formatLongDate(selectedPatient.fechaRegistro)}
                        </span>
                      </div>
                      <div className="border-b border-slate-50 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Fecha de Nacimiento</span>
                        <span className="text-sm font-semibold text-slate-800">
                          {formatLongDate(selectedPatient.fechaNacimiento)}
                        </span>
                      </div>
                      <div className="border-b border-slate-50 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Discapacidad</span>
                        <span className="text-sm font-semibold text-slate-800">{selectedPatient.carnetDiscapacidad || "NO"}</span>
                      </div>
                      <div className="border-b border-slate-50 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Teléfono de Contacto</span>
                        <span className="text-sm font-semibold text-slate-800">{selectedPatient.telefono || "No registrado"}</span>
                      </div>
                      <div className="border-b border-slate-50 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Ocupación / Profesión</span>
                        <span className="text-sm font-semibold text-slate-800 uppercase">{selectedPatient.ocupacion || "No registrado"}</span>
                      </div>
                      <div className="md:col-span-2 border-b border-slate-50 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Dirección Residencia</span>
                        <span className="text-sm font-semibold text-slate-800 uppercase">{selectedPatient.direccion || "No registrada"}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-4 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historial Clínico de Entrada</h4>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-teal-700 block">Motivo & Cuadro Actual</span>
                        <p className="text-xs font-medium text-slate-700 leading-relaxed uppercase mt-0.5">
                          {selectedPatient.medicacionActual || "Ninguno referido."}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200/50">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-600 block">Alergias</span>
                          <span className="text-xs font-semibold text-slate-800 uppercase">{selectedPatient.alergias || "NO"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Operaciones</span>
                          <span className="text-xs font-semibold text-slate-800 uppercase">{selectedPatient.operaciones || "NO"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Patologías Previas (APP)</span>
                          <span className="text-xs font-semibold text-slate-800 uppercase">{selectedPatient.app || "NO"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "clinica" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3 text-center">
                        <span className="flex justify-center text-rose-600 mb-1"><SVGIcon name="heart" /></span>
                        <span className="text-[10px] uppercase tracking-wider text-rose-700 font-bold block">F. Cardíaca</span>
                        <span className="text-lg font-black text-rose-900">{selectedPatient.fc || "--"} <span className="text-[10px] font-normal">lpm</span></span>
                      </div>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 text-center">
                        <span className="flex justify-center text-blue-600 mb-1"><SVGIcon name="activity" /></span>
                        <span className="text-[10px] uppercase tracking-wider text-blue-700 font-bold block">F. Resp</span>
                        <span className="text-lg font-black text-blue-900">{selectedPatient.fr || "--"} <span className="text-[10px] font-normal">rpm</span></span>
                      </div>
                      <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3 text-center">
                        <span className="flex justify-center text-purple-600 mb-1"><SVGIcon name="gauge" /></span>
                        <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold block">Presión Art.</span>
                        <span className="text-lg font-black text-purple-900">{selectedPatient.ta || "--"}</span>
                      </div>
                      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3 text-center">
                        <span className="flex justify-center text-amber-600 mb-1"><SVGIcon name="thermometer" /></span>
                        <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block">Temp.</span>
                        <span className="text-lg font-black text-amber-900">{selectedPatient.temperatura || "--"} <span className="text-[10px] font-normal">°C</span></span>
                      </div>
                      <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
                        <span className="flex justify-center text-teal-600 mb-1">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-teal-700 font-bold block">Sat. O2</span>
                        <span className="text-lg font-black text-teal-900">{selectedPatient.so2 || "--"} <span className="text-[10px] font-normal">%</span></span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {["cabeza", "torax", "abdomen", "extremidades"].map((segment) => (
                        <div key={segment} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <span className="text-xs font-black text-teal-800 uppercase block mb-1">
                            Exploración Física: {segment === "torax" ? "Tórax" : segment}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium uppercase">
                            {selectedPatient[segment] || "Sin observaciones particulares."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "diagnostico" && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
                      <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider block mb-1">Diagnóstico Clínico (CIE-10)</span>
                      <p className="text-base font-black text-teal-950 uppercase">
                        {selectedPatient.diagnostico || "Evaluación pendiente."}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Esquema Terapéutico</span>
                      <p className="text-sm font-semibold text-slate-800 uppercase leading-relaxed whitespace-pre-wrap">
                        {selectedPatient.tratamiento || "No definido."}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Exámenes de Apoyo / Notas de Laboratorio</span>
                      <p className="text-xs font-semibold text-slate-700 uppercase leading-relaxed">
                        {selectedPatient.complementarios || "No solicitados en consulta."}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "seguimientos" && (
                  <div className="space-y-6 animate-fadeIn">
                    <form onSubmit={handleAddFollowUp} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">Añadir Evolución / Sesión de Fisioterapia</span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="date"
                          value={newFollowUpDate}
                          onChange={(e) => setNewFollowUpDate(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newFollowUpText}
                          onChange={(e) => setNewFollowUpText(e.target.value)}
                          placeholder="Resumen de sesión, avances o respuesta clínica..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <button
                          type="submit"
                          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                        >
                          <SVGIcon name="plus" className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </form>

                    <div className="relative border-l-2 border-slate-200 pl-4 space-y-5">
                      {(!selectedPatient.seguimientos || selectedPatient.seguimientos.length === 0) ? (
                        <p className="text-xs text-slate-400 italic">No hay notas de seguimiento registradas para este paciente.</p>
                      ) : (
                        selectedPatient.seguimientos.map((seg) => (
                          <div key={seg.id} className="relative">
                            <span className="absolute -left-[21px] top-1 bg-teal-600 border-4 border-white w-4.5 h-4.5 rounded-full shadow-sm" />
                            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-black text-teal-800">
                                  {formatLongDate(seg.fecha)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFollowUp(selectedPatient.id, seg.id)}
                                  className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition"
                                  title="Borrar nota de evolución"
                                >
                                  <SVGIcon name="trash" className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-xs text-slate-700 uppercase leading-relaxed font-semibold">
                                {seg.nota}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 flex-1 flex flex-col justify-center items-center space-y-4">
              <div className="bg-slate-50 p-4 rounded-full text-teal-600">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-700">Bienvenido al Portal Clínico</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Seleccione un paciente de la lista izquierda o cree uno nuevo para empezar a administrar y monitorizar su historia clínica y proceso de rehabilitación física.
              </p>
              <button 
                onClick={handleStartCreate}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Crear Primer Paciente
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-4 text-center text-xs text-slate-400 print:hidden mt-auto">
        <p>© 2026 Centro de Rehabilitación Integral Monteagudo. Sistema Seguro Local.</p>
      </footer>

      {selectedPatient && (
        <div className="hidden print:block p-8 font-serif bg-white text-black min-h-screen">
          <div className="text-center border-b-4 border-double border-black pb-4 mb-6 relative">
            <h1 className="text-2xl font-black uppercase tracking-wide">Centro de Rehabilitación Integral Monteagudo</h1>
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-700 mt-1">Historia Clínica Médica General</h2>
            <p className="text-[10px] italic text-slate-500 mt-0.5">Monteagudo, Bolivia - Tel: {selectedPatient.telefono || "63359333"}</p>
            {selectedPatient.fechaRegistro && (
              <div className="absolute top-0 right-0 border border-black p-1 text-xs font-bold uppercase">
                Registro: {formatShortDate(selectedPatient.fechaRegistro)}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold bg-slate-100 px-2 py-1 border border-black uppercase mb-3">1. Información Personal del Paciente</h3>
            <table className="w-full text-xs border-collapse border border-black">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4">Nombre Completo:</td>
                  <td className="border border-black p-2 uppercase" colSpan="3">{selectedPatient.nombre}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Fecha Registro:</td>
                  <td className="border border-black p-2 font-bold text-teal-950">{formatShortDate(selectedPatient.fechaRegistro)}</td>
                  <td className="border border-black p-2 font-bold w-1/4">Fecha Nacimiento:</td>
                  <td className="border border-black p-2">{formatShortDate(selectedPatient.fechaNacimiento)}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Edad / Sexo:</td>
                  <td className="border border-black p-2 uppercase">{selectedPatient.edad} años / {selectedPatient.sexo}</td>
                  <td className="border border-black p-2 font-bold">Carnet Discapacidad:</td>
                  <td className="border border-black p-2 uppercase">{selectedPatient.carnetDiscapacidad || "NO"}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Cédula de Identidad:</td>
                  <td className="border border-black p-2">{selectedPatient.cedulaIdentidad || "S/N"}</td>
                  <td className="border border-black p-2 font-bold">Teléfono:</td>
                  <td className="border border-black p-2">{selectedPatient.telefono || "S/D"}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Ocupación:</td>
                  <td className="border border-black p-2 uppercase">{selectedPatient.ocupacion || "S/D"}</td>
                  <td className="border border-black p-2 font-bold">Dirección:</td>
                  <td className="border border-black p-2 uppercase" colSpan="1">{selectedPatient.direccion || "S/D"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold bg-slate-100 px-2 py-1 border border-black uppercase mb-3">2. Antecedentes & Cuadro Clínico de Entrada</h3>
            <div className="border border-black p-3 text-xs space-y-3 leading-relaxed uppercase">
              <p><strong>Motivo de Consulta y Cuadro Clínico:</strong> {selectedPatient.medicacionActual || "Ninguno referido"}</p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-slate-300">
                <p><strong>Alergias:</strong> {selectedPatient.alergias || "NO"}</p>
                <p><strong>Operaciones:</strong> {selectedPatient.operaciones || "NO"}</p>
                <p><strong>APP:</strong> {selectedPatient.app || "NO"}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold bg-slate-100 px-2 py-1 border border-black uppercase mb-3">3. Examen Físico & Signos Vitales</h3>
            <div className="grid grid-cols-5 border border-black text-xs text-center divide-x divide-black bg-slate-50 mb-3">
              <div className="p-2"><strong>F. Cardíaca (FC):</strong> {selectedPatient.fc || "--"} lpm</div>
              <div className="p-2"><strong>F. Resp (FR):</strong> {selectedPatient.fr || "--"} rpm</div>
              <div className="p-2"><strong>Presión (TA):</strong> {selectedPatient.ta || "--"}</div>
              <div className="p-2"><strong>Temp (°C):</strong> {selectedPatient.temperatura || "--"} °C</div>
              <div className="p-2"><strong>Saturación:</strong> {selectedPatient.so2 || "--"} %</div>
            </div>
            <table className="w-full text-xs border-collapse border border-black uppercase">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-1/4">Cabeza:</td>
                  <td className="border border-black p-2">{selectedPatient.cabeza || "Sin particularidades"}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Tórax:</td>
                  <td className="border border-black p-2">{selectedPatient.torax || "Sin particularidades"}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Abdomen:</td>
                  <td className="border border-black p-2">{selectedPatient.abdomen || "Sin particularidades"}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Extremidades:</td>
                  <td className="border border-black p-2">{selectedPatient.extremidades || "Sin particularidades"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold bg-slate-100 px-2 py-1 border border-black uppercase mb-3">4. Diagnóstico Clínico & Tratamiento de Rehabilitación</h3>
            <div className="border border-black p-3 text-xs space-y-3 leading-relaxed uppercase">
              <p className="text-sm"><strong>Diagnóstico Definitivo (Dx):</strong> <span className="font-bold underline">{selectedPatient.diagnostico || "Evaluación pendiente."}</span></p>
              <p><strong>Esquema Terapéutico Indicado:</strong> {selectedPatient.tratamiento || "No indicado"}</p>
              <p><strong>Exámenes de Apoyo / Recomendaciones:</strong> {selectedPatient.complementarios || "Ninguno solicitado"}</p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-bold bg-slate-100 px-2 py-1 border border-black uppercase mb-3">5. Historial de Evolución Terapéutica</h3>
            <div className="border border-black divide-y divide-black text-xs uppercase">
              {(!selectedPatient.seguimientos || selectedPatient.seguimientos.length === 0) ? (
                <p className="p-3 italic text-slate-500">Sin evolución documentada.</p>
              ) : (
                selectedPatient.seguimientos.map((seg, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between gap-4">
                    <span className="font-bold w-28 whitespace-nowrap">{formatShortDate(seg.fecha)}</span>
                    <span className="flex-1 text-slate-700">{seg.nota}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-12 text-center text-xs">
            <div className="space-y-1">
              <div className="border-t border-black w-2/3 mx-auto pt-2" />
              <p className="font-bold">Firma del Profesional Responsable</p>
              <p className="text-[10px] text-slate-500">C.R.I. Monteagudo</p>
            </div>
            <div className="space-y-1">
              <div className="border-t border-black w-2/3 mx-auto pt-2" />
              <p className="font-bold">Firma del Paciente / Tutor</p>
              <p className="text-[10px] text-slate-500">Conformidad con el Tratamiento</p>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 leading-tight">¿Eliminar Ficha Médica?</h4>
              <p className="text-xs text-slate-500 mt-2">
                Está a punto de borrar permanentemente el historial de <strong>{deleteConfirm.name}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ show: false, id: null, name: "" })}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDeletion}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md shadow-rose-600/10"
              >
                Eliminar de todos modos
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <SVGIcon name="info" className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 leading-tight">{modalAlert.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{modalAlert.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setModalAlert(null)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl transition shadow-md shadow-teal-600/10"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
