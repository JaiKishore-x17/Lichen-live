<div align="center">
  <h1>🌿 Lichen-Live</h1>
  <p><b>An End-to-End IoT Real-Time Air Quality & Microclimate Monitoring Ecosystem</b></p>
  
  <h6>
    <code>ESP32 (MCU)</code> • 
    <code>C++ / Arduino Core</code> • 
    <code>Firebase RTDB</code> • 
    <code>React Native</code>
  </h6>
</div>

---

## 📌 Problem Statement
Airborne hazards, chemical pollutants, and micro-climatic shifts are fundamentally invisible threats that directly compromise human health and localized infrastructure. Off-the-shelf residential environmental monitors are structurally flawed: they act as isolated hardware islands lacking real-time data streaming capabilities, aggregate multiple gases into ambiguous "Air Quality Index" scores, and offer no granular access to immediate raw sensor data or historical logs required for contextual data analysis.

---

## ✨ Core Features

> 🔬 **Granular Gas Isolation**
> Isolates concentrations of $CO_2$, Ammonia ($NH_4$), and Nitrogen Dioxide ($NO_2$) dynamically from a single sensing element using specialized mathematical regression scaling.

> 🌪️ **Microsecond Particulate Profiling**
> Leverages microsecond-precision IR pulse timing (280µs stabilization window) to measure real-time particulate matter density in $mg/m^3$ safely and accurately.

> 🧠 **Derived Microclimate Intelligence**
> Computes human-perceived thermal strain via the Heat Index algorithm and determines precise localized condensation levels by calculating the Dew Point dynamically.

> ☁️ **Dual-Stream Data Pipeline**
> Synchronizes data concurrently into an active state repository for immediate application rendering and a permanent historical ledger for long-term analytical tracking.

---

## 🛠️ System Architecture & Tech Stack

The architecture bridges local low-latency sensory hardware to a cloud-backed, cross-platform client app via a real-time event-driven data pipeline.

### Hardware-to-Telemetry Mapping

| Hardware Layer | Telemetry Extracted | Data Processing Role |
| :--- | :--- | :--- |
| **GP2Y1014AU0F** | Optical Dust Density ($mg/m^3$), Analog Voltage | Sampled via microsecond pulse sequences to filter high-current power noise. |
| **MQ-135 Sensor** | $CO_2$, $NH_4$, $NO_2$ PPM Levels, $R_s/R_0$ Ratios | Calculated dynamically using real-time sensor resistance values and base calibrations. |
| **BMP280 Suite** | Barometric Pressure (hPa), Altitude (m), Ambient Temp | Extracted via a digital I2C bus; references sea-level standards to determine altitude changes. |
| **DHT11 Module** | Relative Humidity (%), Base Temperature (°C) | Processes physical atmospheric moisture contents used for environmental derivation models. |

---

## ⚙️ Functional Mechanics

* **Local Telemetry Synthesis:** The ESP32 edge node initiates a structured sample cycle. It drives an hardware RC filter circuit to suppress sensory power ripples, fires the dust sensor's internal infrared emitter, waits exactly 280µs for internal reflection stabilization, gathers the analog payload, and switches the module down to protect system longevity.
* **Structured Payload Framing:** The microcontroller converts multi-sensor raw electrical signals into floating-point environmental metrics. This comprehensive matrix is packed directly into a single unified hierarchical JSON structure, tagged with a network-verified Unix timestamp, and transmitted out over a single TCP request.
* **Reactive Database Distribution:** The Firebase backend consumes the incoming JSON packet. It simultaneously overwrites the system's live snapshot and appends a persistent timestamped ledger instance, immediately broadcasting the state change over an active WebSocket matrix.
* **Instant Edge Render:** The React Native mobile application processes the real-time payload. Utilizing asynchronous stream listeners and optional runtime chaining, the interface maps changes to the UI instantaneously without relying on polling requests.

---
## LichenLive App
<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/fc2c0a94-5e02-4a9f-bbb3-0c3e85e1674c" />
<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/98ebc8d9-9b01-44b2-b2b7-5ecb2067c2b2" />
<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/7aae3ca1-516c-4221-badb-23dedf96df73" />




## 🚀 Future Architectural Scope

* **Edge Predictive Modeling:** Integration of linear regression or simple neural models directly at the MCU layer to predict structural air hazard vectors before thresholds collapse.
* **Closed-Loop Actuation:** Deploying hardware-linked intelligent relay buses to toggle multi-stage local air filtration systems automatically when gaseous thresholds are violated.
* **Autonomous Topology:** Moving the device to a dedicated LiFePO4 battery array integrated with localized micro-solar collection for indefinite off-grid deployment.

---
<div align="center">
  <sub>Built for open-source environmental awareness. Portfolio Case Study.</sub>
</div>
