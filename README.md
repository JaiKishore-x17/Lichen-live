<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lichen-Live Portfolio Case Study</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --accent-color: #10b981;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: #334155;
        }

        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            padding: 40px 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 40px;
        }

        h1 {
            color: var(--accent-color);
            font-size: 2.8rem;
            margin: 0 0 10px 0;
            font-weight: 800;
            letter-spacing: -0.05em;
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--text-muted);
            margin: 0;
        }

        h2 {
            color: var(--text-main);
            font-size: 1.8rem;
            border-left: 4px solid var(--accent-color);
            padding-left: 15px;
            margin-top: 40px;
            margin-bottom: 20px;
        }

        p {
            color: var(--text-muted);
            font-size: 1.05rem;
            margin-bottom: 20px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .card:hover {
            transform: translateY(-4px);
            border-color: var(--accent-color);
        }

        .card h3 {
            color: var(--accent-color);
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 1.25rem;
        }

        .card p {
            font-size: 0.95rem;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border-color);
        }

        th, td {
            padding: 16px;
            text-align: left;
        }

        th {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--accent-color);
            font-weight: 600;
            border-bottom: 1px solid var(--border-color);
        }

        td {
            border-bottom: 1px solid var(--border-color);
            color: var(--text-muted);
        }

        tr:last-child td {
            border-bottom: none;
        }

        .tech-badge-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }

        .tech-badge {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .tech-badge.hardware { border-color: #ef4444; color: #fca5a5; }
        .tech-badge.cloud { border-color: #f59e0b; color: #fcd34d; }
        .tech-badge.mobile { border-color: #3b82f6; color: #93c5fd; }

        ul {
            padding-left: 20px;
            color: var(--text-muted);
        }

        li {
            margin-bottom: 10px;
        }
    </style>

</head>
<body>

    <div class="container">
        <header>
            <h1>Lichen-Live</h1>
            <p class="subtitle">An End-to-End IoT Real-Time Air Quality & Microclimate Monitoring Ecosystem</p>
        </header>

        <section id="problem">
            <h2>Problem Statement</h2>
            <p>Airborne hazards, chemical pollutants, and micro-climatic shifts are fundamentally invisible threats that directly compromise human health and localized infrastructure. Off-the-shelf residential environmental monitors are structurally flawed: they act as isolated hardware islands lacking real-time data streaming capabilities, aggregate multiple gases into ambiguous "Air Quality Index" scores, and offer no granular access to immediate raw sensor data or historical logs required for contextual data analysis.</p>
        </section>

        <section id="features">
            <h2>Core Features</h2>
            <div class="grid">
                <div class="card">
                    <h3>Granular Gas Isolation</h3>
                    <p>Isolates concentrations of CO₂, Ammonia (NH₄), and Nitrogen Dioxide (NO₂) dynamically from a single sensing element using specialized mathematical regression scaling.</p>
                </div>
                <div class="card">
                    <h3>Microsecond Particulate Profiling</h3>
                    <p>Leverages microsecond-precision IR pulse timing (280µs stabilization window) to measure real-time particulate matter density in mg/m³ safely and accurately.</p>
                </div>
                <div class="card">
                    <h3>Derived Microclimate Intelligence</h3>
                    <p>Computes human-perceived thermal strain via the Heat Index algorithm and determines precise localized condensation levels by calculating the Dew Point dynamically.</p>
                </div>
                <div class="card">
                    <h3>Dual-Stream Data Pipeline</h3>
                    <p>Synchronizes data concurrently into an active state repository for immediate application rendering and a permanent historical ledger for long-term analytical tracking.</p>
                </div>
            </div>
        </section>

        <section id="tech-stack">
            <h2>System Architecture & Tech Stack</h2>
            <p>The architecture bridges local low-latency sensory hardware to a cloud-backed, cross-platform client app via a real-time event-driven data pipeline.</p>
            
            <div class="tech-badge-container">
                <span class="tech-badge hardware">ESP32 (MCU)</span>
                <span class="tech-badge hardware">C++ / Arduino Core</span>
                <span class="tech-badge hardware">I2C & Analog Bus</span>
                <span class="tech-badge cloud">Firebase Realtime Database</span>
                <span class="tech-badge cloud">WebSockets</span>
                <span class="tech-badge cloud">NTP Protocol</span>
                <span class="tech-badge mobile">React Native</span>
                <span class="tech-badge mobile">JavaScript</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Hardware Layer</th>
                        <th>Telemetry Extracted</th>
                        <th>Data Processing Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>GP2Y1014AU0F</strong></td>
                        <td>Optical Dust Density (mg/m³), Analog Voltage</td>
                        <td>Sampled via microsecond pulse sequences to filter high-current power noise.</td>
                    </tr>
                    <tr>
                        <td><strong>MQ-135 Sensor</strong></td>
                        <td>CO₂, NH₄, NO₂ PPM Levels, Rs/R0 Ratios</td>
                        <td>Calculated dynamically using real-time sensor resistance values and base calibrations.</td>
                    </tr>
                    <tr>
                        <td><strong>BMP280 Suite</strong></td>
                        <td>Barometric Pressure (hPa), Altitude (m), Ambient Temp</td>
                        <td>Extracted via a digital I2C bus; references sea-level standards to determine altitude changes.</td>
                    </tr>
                    <tr>
                        <td><strong>DHT11 Module</strong></td>
                        <td>Relative Humidity (%), Base Temperature (°C)</td>
                        <td>Processes physical atmospheric moisture contents used for environmental derivation models.</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section id="working">
            <h2>Functional Mechanics</h2>
            <ul>
                <li><strong>Local Telemetry Synthesis:</strong> The ESP32 edge node initiates a structured sample cycle. It drives an hardware RC filter circuit to suppress sensory power ripples, fires the dust sensor's internal infrared emitter, waits exactly 280µs for internal reflection stabilization, gathers the analog payload, and switches the module down to protect system longevity.</li>
                <li><strong>Structured Payload Framing:</strong> The microcontroller converts multi-sensor raw electrical signals into floating-point environmental metrics. This comprehensive matrix is packed directly into a single unified hierarchical JSON structure, tagged with a network-verified Unix timestamp, and transmitted out over a single TCP request.</li>
                <li><strong>Reactive Database Distribution:</strong> The Firebase backend consumes the incoming JSON packet. It simultaneously overwrites the system's live snapshot and appends a persistent timestamped ledger instance, immediately broadcasting the state change over an active WebSocket matrix.</li>
                <li><strong>Instant Edge Render:</strong> The React Native mobile application processes the real-time payload. Utilizing asynchronous stream listeners and optional runtime chaining, the interface maps changes to the UI instantaneously without relying on polling requests.</li>
            </ul>
        </section>

        <section id="innovations">
            <h2>Future Architectural Scope</h2>
            <ul>
                <li><strong>Edge Predictive Modeling:</strong> Integration of linear regression or simple neural models directly at the MCU layer to predict structural air hazard vectors before thresholds collapse.</li>
                <li><strong>Closed-Loop Actuation:</strong> Deploying hardware-linked intelligent relay buses to toggle multi-stage local air filtration systems automatically when gaseous thresholds are violated.</li>
                <li><strong>Autonomous Topology:</strong> Moving the device to a dedicated LiFePO4 battery array integrated with localized micro-solar collection for indefinite off-grid deployment.</li>
            </ul>
        </section>
    </div>

</body>
</html>