let liste = [];
let abdo = [];
let biceps = [];
let triceps = [];
let fessier = [];
let dos = [];
let pectoraux = [];
let prog = [];

let dureeVoulue = 0; //en secondes
let difficulty = 0;
let type = [];
const inputDureeHeure = document.getElementById("heure");
const inputDureeMin = document.getElementById("minute");
const selectDifficulty = document.getElementById("difficulty");
const inputs = document.querySelectorAll('input[type="checkbox"]');
const app = document.getElementById("app");

// Créer le JS du form pour récup les infos puis faire une méthode pour créer la séance puis une pour l'afficher et une pour donner le code texte du programme

// Pour récupérer les donnés entrées dans le form

class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = prog[this.index].difficulty.min;
    this.seconds = prog[this.index].difficulty.s;
  }

  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        this.index++;
        if (this.index < prog.length) {
          this.minutes = prog[this.index].difficulty.min;
          this.seconds = prog[this.index].difficulty.s;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 100);

    return (app.innerHTML = `
      <div class="exercice-container">
        <h2>${prog[this.index].nom}</h2>
        <p>${this.minutes}:${this.seconds}</p>
        <img src="${prog[this.index].img1}" />
        <div>${this.index + 1}/${prog.length}</div>
      </div>`);
  }
}

const utils = {
  form: function () {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (selectDifficulty.value == "Très facile") {
        difficulty = 0;
      }
      if (selectDifficulty.value == "Facile") {
        difficulty = 1;
      }
      if (selectDifficulty.value == "Normale") {
        difficulty = 2;
      }
      if (selectDifficulty.value == "Difficile") {
        difficulty = 3;
      }
      if (selectDifficulty.value == "Très difficile") {
        difficulty = 4;
      }

      dureeVoulue = inputDureeHeure.value * 3600 + inputDureeMin.value * 60;
      let i = 0;
      type = [];
      inputs.forEach((a) => {
        if (a.checked) {
          type[i] = a.id;
          i++;
        }
      });
      if (dureeVoulue != 0 && type[0] != null) {
        utils
          .creerSeance(dureeVoulue, difficulty, type)
          .then((res) => {
            console.log(utils.affichageTexteSeance(res));
            prog = res;
          })
          .then(() => page.postCreation());
      }
    });
  },

  // Pour avoir les tableaux par type des exos

  maj: async function () {
    await fetch("http://localhost:3000/posts")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        liste = data;
      });
    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;
    let f = 0;
    let g = 0;
    liste.forEach((e) => {
      if (e.type == "abdo") {
        abdo[a] = e;
        a++;
      }
      if (e.type == "biceps") {
        abdo[b] = e;
        b++;
      }
      if (e.type == "triceps") {
        abdo[c] = e;
        c++;
      }
      if (e.type == "fessier") {
        abdo[d] = e;
        d++;
      }
      if (e.type == "dos") {
        abdo[f] = e;
        f++;
      }
      if (e.type == "pectoraux") {
        abdo[g] = e;
        g++;
      }
    });
    // console.log(abdo);
  },

  // Pour créer le programme de la séance de sport

  creerSeance: async function (duree, difficulty, type) {
    await utils.maj();

    let obj = {};
    obj.abdo = abdo;
    obj.biceps = biceps;
    obj.triceps = triceps;
    obj.fessier = fessier;
    obj.dos = dos;
    obj.pectoraux = pectoraux;

    let dureeSeance = 0;
    let i = 0;
    let programme = [];
    while (dureeSeance < duree) {
      type.forEach((t) => {
        if (dureeSeance > duree) {
          br;
        } else {
          programme[i] = Object.create(
            obj[t][Math.floor(Math.random() * obj[t].length)]
          );
          dureeSeance += programme[i].difficulty[difficulty]["duree:"];
          let temp = programme[i].difficulty[difficulty];
          delete programme[i].difficulty;
          programme[i].difficulty = temp;
        }
        i++;
      });
    }
    console.log(programme);
    return programme;
  },

  affichageTexteSeance: function (programme) {
    let res = `Programme :\n`;
    for (const e of programme) {
      res += `- ${e.difficulty.affichage} ${e.nom}\n`;
    }
    return res;
  },

  handleEventArrows: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        prog.map((exo, index) => {
          if ((prog[position].id = exo.id && position !== 0)) {
            [prog[position], prog[position - 1]] = [
              prog[position - 1],
              prog[position],
            ];
            page.postCreation();
          } else {
            position++;
          }
        });
      });
    });
  },

  deleteExo: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        console.log(e);
        newprog = [];
        prog.map((exo) => {
          if (e.target.dataset.pic != exo.id) {
            newprog.push(exo);
          }
        });
        prog = newprog;
        page.postCreation();
      });
    });
  },
};

const page = {
  lobby: function () {
    utils.form();
  },
  postCreation: function () {
    let mapArray = prog
      .map(
        (exo, index) =>
          `
        <li>
          <div class="card-header">
            <h3>${exo.nom}</h3>
            <p>${exo.difficulty.min}min${exo.difficulty.s}s</p>
          </div>
          <img src="${exo.img1}" />
          <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${index}><</i>
          <i class="fas fa-times-circle deleteBtn" data-pic=${index}>Supprimer</i>
        </li>
      `
      )
      .join("");

    app.innerHTML = `
    <h1>Paramétrage <i id='reboot' class='fas fa-undo'></i></h1>
    <main><ul> ${mapArray} </ul></main>
    <div class="btn-container"><button id='start'>Commencer<i class='far fa-play-circle'></i></button></div>
    `;
    start.addEventListener("click", () => this.routine());
    utils.handleEventArrows();
    utils.deleteExo();
  },

  routine: function () {
    const exercice = new Exercice();
    exercice.updateCountdown();
  },

  finish: function () {
    app.innerHTML = `<h1>C'est terminé</h1>
    <button id ='start' >Revenir à la page d'accueil </button>
    `;
    start.addEventListener("click", () => {
      prog = [];
      window.location.reload();
    });
  },
};
page.lobby();
