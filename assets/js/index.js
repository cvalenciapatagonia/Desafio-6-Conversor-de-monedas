//? DECLARACION DE VARIABLES

const pesosInput = document.querySelector("input");
const monedaSelect = document.querySelector(".moneda-select");
const btn = document.querySelector("button");
const span = document.querySelector("span");
const limpiarBtn = document.getElementById("limpiar-btn");
const urlBase = "https://mindicador.cl/api";
let myChart; 

//? EVENTO CLIC AL BOTON CONVERTIDOR

btn.addEventListener("click", async () => {
  buscarValor();
});

//? EVENTO ENTER AL TERMINAR DE INGRESAR DATOS

pesosInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    buscarValor();
  }
});

//? FUNCION PARA CONVERSION DE MONEDA

async function buscarValor() {
  const { value: pesos } = pesosInput;
  const { value: monedaSelected } = monedaSelect;

  const valorDeLaMoneda = await search(monedaSelected);
  const valorFinal = (pesos / valorDeLaMoneda).toFixed(2);
  span.innerHTML = `Resultado: $${valorFinal}`;
}

//? FUNCION DE SOLICITUD A LA API PARA OBTENER VALORES DE MONEDA

async function search(moneda) {
  try {
    const res = await fetch(`${urlBase}/${moneda}`);
    const data = await res.json();
    const { serie } = data;
    const datos = createDataToChart(serie.slice(0, 10).reverse());
    renderGrafica(datos);
    const [{ valor: valorDeLaMoneda }] = serie;
    return valorDeLaMoneda;
  } catch (error) {
    alert("En este momento presentamos dificultades, inténtalo de nuevo más tarde");
    console.log(error);
  }
}

//? FUNCION QUE RENDERIZA EL GRAFICO

function renderGrafica(data) {
  const config = {
    type: "line",
    data,
  };
  if (myChart) {
    myChart.destroy(); 
  }
  myChart = new Chart("myChart", config); 
}

//? FUNCION QUE CREA DATOS PARA GRAFICO

function createDataToChart(serie) {
  const labels = serie.map(({ fecha }) => formatDate(fecha));
  const data = serie.map(({ valor }) => valor);
  const datasets = [
    {
      label: "Historial últimos 10 días",
      borderColor: "red",
      data,
    },
  ];
  return { labels, datasets };
}

//? FUNCION QUE FORMATEA FECHA

function formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

//? EVENTO DE LIMPIEZA DE CARACTERES INGRESADOS

limpiarBtn.addEventListener("click", () => {
  pesosInput.value = "";
  monedaSelect.selectedIndex = 0;
  span.innerHTML = "";
  if (myChart) {
    myChart.destroy(); 
  }
});