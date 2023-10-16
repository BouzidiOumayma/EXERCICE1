var platforme = [];
var platforme_counter = [];
var duree = [];
var duree_counter = [];
var niveau = [];
var niveau_counter = [];
var objectif = [];
var objectif_counter = [];
var preference = [];
var preference_counter = [];
var fonctionalite = [];
var fonctionalite_counter = [];
var utilisation = [];
var utilisation_counter = [];


// Fonction pour charger les données directement depuis le lien du formulaire Google Sheets
async function loadCSVFromURL() {
    const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKAGwYx8H72GlvZSeHLHiZo612vbYZzmsqbP17_Y2zCzfLeQXEU5phUxuB-NEqTcBIJp8o2Oh9JevX/pub?output=csv";

    try {
        const response = await fetch(googleSheetsUrl);
        if (response.ok) {
            const data = await response.text();
            const lines = data.split('\n');
            
            lines.forEach((line, index) => {
                const cols = splitCSV(line);
                const card = document.createElement('div');
                card.classList.add('card');
    
                cols.forEach((col, colIndex) => {
                    const cell = document.createElement('div');
                    cell.classList.add('card-info');
    
                    const image_check = col.includes("drive");
                    if (image_check) {
                        const link = 'http://drive.google.com/uc?export=view&id=';
                        const id = col.slice(col.indexOf('=') + 1);
                        const imgElement = document.createElement('img');
                        imgElement.src = link + id;
                        imgElement.width = "120";
                        imgElement.height = "150";
                        cell.appendChild(imgElement);
                    } else {
                        cell.textContent = col;
                    }
    
                    if (index === 0) {
                        const filterInput = document.createElement('input');
                        filterInput.placeholder = 'Filter...';
                
                        filterInput.addEventListener('input', () => {
                            filterData(colIndex, filterInput.value);
                        });
                
                        if (colIndex !== 3) {
                            cell.appendChild(filterInput);
                        }
                    }
                
                    card.appendChild(cell);
    
                    if (index !== 0) {
                        if (colIndex === 4) {
                            if (platforme.includes(cell.textContent)) {
                                platforme_counter[platforme.indexOf(cell.textContent)]++;
                            } else {
                                platforme.push(cell.textContent);
                                platforme_counter.push(1);
                            }
                        }
    
                        if (colIndex === 5) {
                            if (duree.includes(cell.textContent)) {
                                duree_counter[duree.indexOf(cell.textContent)]++;
                            } else {
                                duree.push(cell.textContent);
                                duree_counter.push(1);
                            }
                        }
    
                        if (colIndex === 6) {
                            if (niveau.includes(cell.textContent)) {
                                niveau_counter[niveau.indexOf(cell.textContent)]++;
                            } else {
                                niveau.push(cell.textContent);
                                niveau_counter.push(1);
                            }
                        }
    
                        if (colIndex === 8) {
                            if (objectif.includes(cell.textContent)) {
                                objectif_counter[objectif.indexOf(cell.textContent)]++;
                            } else {
                                objectif.push(cell.textContent);
                                objectif_counter.push(1);
                            }
                        }
    
                        if (colIndex === 9) {
                            if (preference.includes(cell.textContent)) {
                                preference_counter[preference.indexOf(cell.textContent)]++;
                            } else {
                                preference.push(cell.textContent);
                                preference_counter.push(1);
                            }
                        }
    
                        if (colIndex === 10) {
                            if (utilisation.includes(cell.textContent)) {
                                utilisation_counter[utilisation.indexOf(cell.textContent)]++;
                            } else {
                                utilisation.push(cell.textContent);
                                utilisation_counter.push(1);
                            }
                        }
    
                        if (colIndex === 11) {
                            if (fonctionalite.includes(cell.textContent)) {
                                fonctionalite_counter[fonctionalite.indexOf(cell.textContent)]++;
                            } else {
                                fonctionalite.push(cell.textContent);
                                fonctionalite_counter.push(1);
                            }
                        }
                    }
                });
    
                document.body.appendChild(card);
            });
    
            createDonutChart(platforme, platforme_counter, "Platforme Préférée");
            createDonutChart(duree, duree_counter, "Durée");
            createDonutChart(niveau, niveau_counter, "Fréquence de publication");
            createDonutChart(objectif, objectif_counter, "Raison d'utilisation");
            createDonutChart(preference, preference_counter, "Impact mental & émotionnel");
            createDonutChart(utilisation, utilisation_counter, "Impact relationnel");
            createDonutChart(fonctionalite, fonctionalite_counter, "Fonctionalités utiles");
        } else {
            console.error('Erreur lors de la récupération du fichier CSV.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite : ' + error);
    }
}

function filterData(colData, inputValue) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const cardInfos = card.querySelectorAll('.card-info')[colData];
        let cardContent = '';

        if (cardInfos) {
            cardContent = cardInfos.textContent || cardInfos.innerText;
        }

        if (cardContent.toLowerCase().includes(inputValue.toLowerCase())) {
            card.style.display = '';  // Affiche la carte si elle correspond au filtre
        } else {
            card.style.display = 'none';  // Masque la carte si elle ne correspond pas au filtre
        }
    });
}



// Fonction pour diviser une ligne CSV en colonnes
function splitCSV(text) {
    let res = [];
    let quote = false;
    let field = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === ',' && !quote) {
            res.push(field);
            field = '';
        } else if (char === '"') {
            if (quote) {
                if (i < text.length - 1 && text[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    quote = false;
                }
            } else {
                quote = true;
            }
        } else {
            field += char;
        }
    }
    if (field) res.push(field);
    return res;
}

// Fonction pour créer des graphiques à secteurs (camemberts)
function createDonutChart(data, dataCounter, titre_graph) {
    var width = 150;
    var height = 150;
    var radius = Math.min(width, height) / 2;
    var innerRadius = 0.4 * radius;

    var color = d3.scaleOrdinal()
        .domain(data)
        .range(data.map(() => getRandomColor()));

    var chartContainer = d3.select("body")
        .append("div")
        .style("display", "inline-block")
        .style("width", "30%")
        .style("margin", "10px");

    chartContainer.append("div")
        .style("font-size", "20px")
        .text(titre_graph);

    var chart = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d; });

    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(innerRadius);

    var arcs = chart.selectAll("arc")
        .data(pie(dataCounter))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) { return color(i); });

    var total_cl = d3.sum(dataCounter);

    arcs.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "0.35em") // Ajustez la position verticale du texte
        .style("font-size", "10px") // Modifiez la taille de police
        .style("font-weight", "bold") // Rendez le texte en gras
        .text(function (d, i) { return (d.data / total_cl * 100).toFixed(2) + '%'; });

    var legend = chartContainer.append("div")
        .attr("class", "legend")
        .style("text-align", "left")
        .style("margin-top", "20px");

    legend.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .style("font-size", "14px")
        .style("display", "flex")
        .style("align-items", "center")
        .each(function (d, i) {
            var legendColor = d3.select(this)
                .append("div")
                .style("width", "20px")
                .style("height", "20px")
                .style("background-color", color(i))
                .style("margin-right", "5px");

            var legendText = d3.select(this)
                .append("div")
                .text(data[i]);
        });
}

// Fonction pour générer des couleurs aléatoires (utilisée pour la légende)
function getRandomColor() {
    var r = Math.floor(Math.random() * 101) + 150; // Composante rouge entre 150 et 250 (plus clair)
    var g = Math.floor(Math.random() * 101) + 150; // Composante verte entre 150 et 250 (plus clair)
    var b = Math.floor(Math.random() * 101) + 150; // Composante bleue entre 150 et 250 (plus clair)
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// Appel de la fonction pour charger les données depuis Google Sheets

