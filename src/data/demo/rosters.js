// [code, name, number, team]
const ROSTER_2024 = [
  ["VER", "Max Verstappen", 1, "Red Bull Racing"],
  ["PER", "Sergio Pérez", 11, "Red Bull Racing"],
  ["HAM", "Lewis Hamilton", 44, "Mercedes"],
  ["RUS", "George Russell", 63, "Mercedes"],
  ["LEC", "Charles Leclerc", 16, "Ferrari"],
  ["SAI", "Carlos Sainz", 55, "Ferrari"],
  ["NOR", "Lando Norris", 4, "McLaren"],
  ["PIA", "Oscar Piastri", 81, "McLaren"],
  ["ALO", "Fernando Alonso", 14, "Aston Martin"],
  ["STR", "Lance Stroll", 18, "Aston Martin"],
  ["GAS", "Pierre Gasly", 10, "Alpine"],
  ["OCO", "Esteban Ocon", 31, "Alpine"],
  ["ALB", "Alexander Albon", 23, "Williams"],
  ["SAR", "Logan Sargeant", 2, "Williams"],
  ["TSU", "Yuki Tsunoda", 22, "RB"],
  ["RIC", "Daniel Ricciardo", 3, "RB"],
  ["BOT", "Valtteri Bottas", 77, "Kick Sauber"],
  ["ZHO", "Zhou Guanyu", 24, "Kick Sauber"],
  ["MAG", "Kevin Magnussen", 20, "Haas F1 Team"],
  ["HUL", "Nico Hülkenberg", 27, "Haas F1 Team"],
];

const ROSTER_2023 = [
  ["VER", "Max Verstappen", 1, "Red Bull Racing"],
  ["PER", "Sergio Pérez", 11, "Red Bull Racing"],
  ["HAM", "Lewis Hamilton", 44, "Mercedes"],
  ["RUS", "George Russell", 63, "Mercedes"],
  ["LEC", "Charles Leclerc", 16, "Ferrari"],
  ["SAI", "Carlos Sainz", 55, "Ferrari"],
  ["NOR", "Lando Norris", 4, "McLaren"],
  ["PIA", "Oscar Piastri", 81, "McLaren"],
  ["ALO", "Fernando Alonso", 14, "Aston Martin"],
  ["STR", "Lance Stroll", 18, "Aston Martin"],
  ["GAS", "Pierre Gasly", 10, "Alpine"],
  ["OCO", "Esteban Ocon", 31, "Alpine"],
  ["ALB", "Alexander Albon", 23, "Williams"],
  ["SAR", "Logan Sargeant", 2, "Williams"],
  ["TSU", "Yuki Tsunoda", 22, "AlphaTauri"],
  ["DEV", "Nyck de Vries", 21, "AlphaTauri"],
  ["BOT", "Valtteri Bottas", 77, "Alfa Romeo"],
  ["ZHO", "Zhou Guanyu", 24, "Alfa Romeo"],
  ["MAG", "Kevin Magnussen", 20, "Haas F1 Team"],
  ["HUL", "Nico Hülkenberg", 27, "Haas F1 Team"],
];

function toDrivers(rows) {
  return Object.fromEntries(
    rows.map(([code, name, number, team]) => [code, { code, name, number, team }]),
  );
}

export const demoRosters = {
  2024: toDrivers(ROSTER_2024),
  2023: toDrivers(ROSTER_2023),
};
