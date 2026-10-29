/**
 * Demo race definitions.
 *
 * Calendar metadata is realistic; `grid`, `order`, `retired` and `fastestLap`
 * are FABRICATED sample values (see ./README.md).
 *
 * - `grid`:  all 20 driver codes in qualifying order.
 * - `order`: all 20 driver codes in finishing order. Retired drivers must be
 *            listed last.
 * - `retired`: map of driver code -> retirement reason.
 * - `baseLap`: reference lap time in seconds, used to derive sample lap times.
 */
export const demoRaceDefinitions = {
  2024: [
    {
      round: 1,
      name: "Bahrain Grand Prix",
      circuit: "Bahrain International Circuit",
      country: "Bahrain",
      date: "2024-03-02",
      laps: 57,
      baseLap: 93.4,
      grid: "VER LEC SAI PER RUS NOR PIA ALO HAM STR TSU ZHO RIC GAS ALB MAG HUL BOT OCO SAR",
      order:
        "VER PER SAI LEC RUS NOR HAM PIA ALO STR ZHO TSU RIC HUL MAG ALB GAS BOT OCO SAR",
      retired: { OCO: "Engine", SAR: "Gearbox" },
      fastestLap: "LEC",
    },
    {
      round: 2,
      name: "Saudi Arabian Grand Prix",
      circuit: "Jeddah Corniche Circuit",
      country: "Saudi Arabia",
      date: "2024-03-09",
      laps: 50,
      baseLap: 91.7,
      grid: "VER LEC PER PIA ALO NOR RUS SAI HAM TSU HUL STR OCO ZHO MAG GAS ALB BOT RIC SAR",
      order:
        "VER PER LEC PIA ALO SAI RUS NOR HAM HUL TSU ZHO STR OCO MAG GAS ALB RIC BOT SAR",
      retired: { BOT: "Hydraulics", SAR: "Collision" },
      fastestLap: "PIA",
    },
    {
      round: 3,
      name: "Australian Grand Prix",
      circuit: "Albert Park Circuit",
      country: "Australia",
      date: "2024-03-24",
      laps: 58,
      baseLap: 80.9,
      grid: "VER SAI NOR PIA LEC RUS PER HAM ALO TSU ALB HUL STR GAS RIC MAG OCO ZHO BOT SAR",
      order:
        "SAI LEC NOR PIA PER ALO TSU HUL STR GAS RIC ZHO OCO ALB MAG BOT SAR HAM RUS VER",
      retired: { HAM: "Engine", RUS: "Collision", VER: "Brakes" },
      fastestLap: "NOR",
    },
    {
      round: 4,
      name: "Japanese Grand Prix",
      circuit: "Suzuka Circuit",
      country: "Japan",
      date: "2024-04-07",
      laps: 53,
      baseLap: 94.3,
      grid: "VER PER NOR SAI ALO LEC PIA HAM RUS TSU RIC GAS HUL ALB OCO STR MAG ZHO BOT SAR",
      order:
        "VER PER SAI LEC NOR ALO RUS PIA HAM TSU RIC HUL ALB OCO STR MAG GAS ZHO BOT SAR",
      retired: { SAR: "Power loss" },
      fastestLap: "VER",
    },
  ],
  2023: [
    {
      round: 1,
      name: "Bahrain Grand Prix",
      circuit: "Bahrain International Circuit",
      country: "Bahrain",
      date: "2023-03-05",
      laps: 57,
      baseLap: 94.1,
      grid: "VER LEC PER SAI HAM STR GAS ALO OCO RUS ALB NOR PIA TSU MAG HUL ZHO BOT SAR DEV",
      order:
        "VER PER ALO SAI HAM STR RUS LEC GAS OCO ALB NOR PIA TSU ZHO MAG HUL SAR BOT DEV",
      retired: { BOT: "Electrical", DEV: "Suspension" },
      fastestLap: "RUS",
    },
    {
      round: 2,
      name: "Saudi Arabian Grand Prix",
      circuit: "Jeddah Corniche Circuit",
      country: "Saudi Arabia",
      date: "2023-03-19",
      laps: 50,
      baseLap: 92.2,
      grid: "PER LEC VER ALO SAI HAM STR GAS OCO RUS ALB NOR PIA TSU MAG HUL ZHO BOT SAR DEV",
      order:
        "PER VER ALO SAI HAM STR RUS LEC OCO GAS ALB NOR TSU PIA MAG HUL ZHO BOT SAR DEV",
      retired: { SAR: "Collision", DEV: "Gearbox" },
      fastestLap: "VER",
    },
    {
      round: 3,
      name: "Australian Grand Prix",
      circuit: "Albert Park Circuit",
      country: "Australia",
      date: "2023-04-02",
      laps: 58,
      baseLap: 81.6,
      grid: "VER HAM RUS ALO SAI STR NOR GAS OCO PER ALB TSU PIA MAG HUL ZHO BOT SAR DEV LEC",
      order:
        "VER HAM ALO STR RUS NOR ALB SAI PER OCO TSU GAS PIA MAG HUL ZHO BOT DEV SAR LEC",
      retired: { SAR: "Collision", LEC: "Collision" },
      fastestLap: "HAM",
    },
    {
      round: 4,
      name: "Azerbaijan Grand Prix",
      circuit: "Baku City Circuit",
      country: "Azerbaijan",
      date: "2023-04-30",
      laps: 51,
      baseLap: 106.4,
      grid: "LEC PER VER SAI ALO RUS HAM STR OCO GAS ALB NOR PIA TSU MAG HUL ZHO BOT SAR DEV",
      order:
        "PER VER ALO HAM LEC SAI RUS STR OCO GAS NOR PIA ALB TSU MAG HUL ZHO BOT SAR DEV",
      retired: { SAR: "Brakes", DEV: "Power loss" },
      fastestLap: "LEC",
    },
  ],
};
