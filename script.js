// PLAN LINEAL
async function iniciarPlanLineal() {
    const tareas = document.querySelectorAll("#linealTasks .task");
    const total = tareas.length;
  
    for (let i = 0; i < tareas.length; i++) {
      const tarea = tareas[i];
  
      tarea.classList.remove("pending", "completed");
      tarea.classList.add("running");
      actualizarIcono(tarea, "running");
  
      await delay(1000);
  
      tarea.classList.remove("running");
      tarea.classList.add("completed");
      actualizarIcono(tarea, "completed");
  
      // Actualizar progreso lineal
      const completadas = i + 1;
      const progreso = Math.round((completadas / total) * 100);
  
      const barra = document.getElementById("linealProgress");
      barra.style.width = `${progreso}%`;
      barra.innerText = `${progreso}%`;
  
      document.getElementById("linealCounter").innerText = `${completadas} de ${total} tareas completadas`;
    }
  }
  
  // PLAN PARCIAL
  const tareasParcial = {
    ingresar: { pre: [], agentes: ["sistema"] },
    llenar_formulario: { pre: ["ingresar"], agentes: ["estudiante"] },
    presentar_docs: { pre: ["llenar_formulario"], agentes: ["estudiante"] },
    verificar_docs: { pre: ["presentar_docs"], agentes: ["administrador"] },
    crear_cuenta: { pre: ["verificar_docs", "llenar_formulario"], agentes: ["sistema"] },
    login: { pre: ["crear_cuenta"], agentes: ["estudiante"] },
    verificar_identidad: { pre: ["login"], agentes: ["sistema"] },
    redirigir: { pre: ["verificar_identidad"], agentes: ["sistema"] },
    docente_tareas: { pre: ["crear_cuenta"], agentes: ["docente"] },
  };
  
  let realizadas = new Set();
  
  async function iniciarPlanParcial() {
    // Reset visual
    document.querySelectorAll("#parcialTasks .task").forEach(t => {
      t.classList.remove("running", "completed");
      t.classList.add("pending");
      actualizarIcono(t, "pending");
    });
  
    realizadas.clear();
    const total = Object.keys(tareasParcial).length;
  
    let tiempo = 0;
  
    while (realizadas.size < total) {
      const ejecutables = [];
  
      for (const [id, data] of Object.entries(tareasParcial)) {
        if (!realizadas.has(id) && data.pre.every(p => realizadas.has(p))) {
          ejecutables.push(id);
        }
      }
  
      if (ejecutables.length === 0) break;
  
      for (const id of ejecutables) {
        const div = document.getElementById(id);
        div.classList.remove("pending");
        div.classList.add("running");
        actualizarIcono(div, "running");
      }
  
      await delay(1000);
  
      for (const id of ejecutables) {
        const div = document.getElementById(id);
        div.classList.remove("running");
        div.classList.add("completed");
        actualizarIcono(div, "completed");
        realizadas.add(id);
      }
  
      // Actualizar progreso parcial
      const completadas = realizadas.size;
      const progreso = Math.round((completadas / total) * 100);
  
      const barra = document.getElementById("parcialProgress");
      barra.style.width = `${progreso}%`;
      barra.innerText = `${progreso}%`;
  
      document.getElementById("parcialCounter").innerText = `${completadas} de ${total} tareas completadas`;
  
      tiempo++;
    }
  }
  
  // ICONOS DE ESTADO
  function actualizarIcono(tarea, estado) {
    const icono = tarea.querySelector(".icono-estado");
    if (!icono) return;
  
    switch (estado) {
      case "pending":
        icono.className = "bi bi-hourglass-split me-2 icono-estado";
        break;
      case "running":
        icono.className = "bi bi-arrow-repeat me-2 icono-estado";
        break;
      case "completed":
        icono.className = "bi bi-check-circle-fill me-2 icono-estado";
        break;
    }
  }
  
  // DELAY
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // REINICIAR TODO
  document.getElementById("reiniciarBtn").addEventListener("click", reiniciarTareas);
  
  function reiniciarTareas() {
    // Reiniciar tareas lineales
    const linealTareas = document.querySelectorAll("#linealTasks .task");
    linealTareas.forEach(t => {
      t.classList.remove("running", "completed");
      t.classList.add("pending");
      actualizarIcono(t, "pending");
    });
  
    document.getElementById("linealProgress").style.width = "0%";
    document.getElementById("linealProgress").innerText = "0%";
    document.getElementById("linealCounter").innerText = `0 de ${linealTareas.length} tareas completadas`;
  
    // Reiniciar tareas parciales
    const parcialTareas = document.querySelectorAll("#parcialTasks .task");
    parcialTareas.forEach(t => {
      t.classList.remove("running", "completed");
      t.classList.add("pending");
      actualizarIcono(t, "pending");
    });
  
    realizadas.clear();
  
    document.getElementById("parcialProgress").style.width = "0%";
    document.getElementById("parcialProgress").innerText = "0%";
    document.getElementById("parcialCounter").innerText = `0 de ${parcialTareas.length} tareas completadas`;
  }
  
