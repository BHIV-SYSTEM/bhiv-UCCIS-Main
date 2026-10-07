import React, {



  useCallback,



  useEffect,



  useMemo,



  useRef,



  useState,



} from "react";







import {



  Line,



  Bar,



  Pie,



  Doughnut,



} from "react-chartjs-2";







import {



  Chart as ChartJS,



  CategoryScale,



  LinearScale,



  PointElement,



  LineElement,



  BarElement,



  ArcElement,



  Tooltip,



  Legend,



  Title,



  Filler,



} from "chart.js";







/* =========================================================



   CHART.JS REGISTRATION



========================================================= */







ChartJS.register(



  CategoryScale,



  LinearScale,



  PointElement,



  LineElement,



  BarElement,



  ArcElement,



  Tooltip,



  Legend,



  Title,



  Filler



);







/* =========================================================



   CONSTANTS



========================================================= */







const API_URL =



  process.env.REACT_APP_API_URL ||



  "http://localhost:5000/api";







const INTELLIGENCE_URL =



  `${API_URL}/intelligence/run`;







const COLORS = {



  green: "#00ff9c",



  greenDark: "#00a86b",



  blue: "#3ca4e8",



  orange: "#ff9f3b",



  red: "#ff4d4d",



  yellow: "#ffcc58",



  pink: "#ff5a83",



  background: "#020403",



  panel: "#101010",



  card: "#181818",



  text: "#ffffff",



  muted: "#7fffce",



};







/* =========================================================



   MOCK INTELLIGENCE OUTPUT



========================================================= */







const MOCK_INTELLIGENCE_OUTPUT = {



  success: true,







  convergence: {



    tantra_convergence: true,







    trace_continuity:



      "TRACE-1778139637014",







    deterministic: true,



    governance_safe: true,



    replayable: true,



    reconstructable: true,



    anomaly_visible: true,







    flow: {



      real_signal: {



        pipeline_status: "SUCCESS",







        raw_data: {



          weather: {



            source: "weather_api",



            rainfall_mm: 140,



            storm_probability: 88,



            timestamp: 1778139637014,



          },







          flooding: {



            source: "flooding_feed",



            flood_risk: 95,



            water_level: "CRITICAL",



            timestamp: 1778139637014,



          },







          traffic: {



            source: "traffic_api",



            congestion_index: 82,



            accident_reports: 14,



            timestamp: 1778139637014,



          },







          complaints: {



            source: "civic_dataset",



            complaint_volume: 420,



            emergency_complaints: 120,



            timestamp: 1778139637014,



          },



        },







        tantra_signals: {



          traffic: {



            score: 82,



            level: "HIGH",



          },







          flooding: {



            score: 95,



            level: "HIGH",



          },







          complaints: {



            score: 120,



            level: "HIGH",



          },







          weather_signal: {



            rainfall_mm: 140,



            storm_probability: 88,



          },



        },







        ingested_at: 1778139637014,



      },







      intelligence: {



        current_state: {



          trace_id:



            "TRACE-1778139637014",







          zone_id: 4,







          dominant_domain:



            "complaints",







          final_score: 120,







          final_level: "HIGH",







          trend: "STABLE",







          behavior: "STABLE",







          reason:



            "complaints override activated",







          governance_request: {



            governance_id:



              "GOV-1778139637014",







            dominant_domain:



              "complaints",







            final_score: 120,







            final_level: "HIGH",







            requested_action:



              "EMERGENCY_RESPONSE",







            created_at:



              1778139637014,



          },







          governance_response: {



            lifecycle_state:



              "ESCALATED",







            lifecycle_reason:



              "Critical urban condition",



          },







          retry_data: {},







          timestamp:



            1778139637014,







          duration_in_state_ms: 0,







          influenced_domains: {



            traffic: {



              score: 102,



              level: "HIGH",



              influenced_by: "flooding",



            },







            flooding: {



              score: 95,



              level: "HIGH",



            },







            water_shortage: {



              score: 70,



              level: "MEDIUM",



            },







            waste_overload: {



              score: 40,



              level: "LOW",



            },







            complaints: {



              score: 120,



              level: "HIGH",



            },



          },







          anomalies: [],







          cluster_intelligence: {



            propagated_zones: [



              {



                influenced_zone: 2,



                propagated_risk: 20,



                propagation_reason:



                  "Zone 4 influenced neighboring zone 2",



              },







              {



                influenced_zone: 3,



                propagated_risk: 20,



                propagation_reason:



                  "Zone 4 influenced neighboring zone 3",



              },







              {



                influenced_zone: 5,



                propagated_risk: 20,



                propagation_reason:



                  "Zone 4 influenced neighboring zone 5",



              },







              {



                influenced_zone: 6,



                propagated_risk: 20,



                propagation_reason:



                  "Zone 4 influenced neighboring zone 6",



              },



            ],







            cluster_score: 40,







            cluster_state:



              "STABLE_CLUSTER",



          },







          confidence: {



            confidence_score: 90,







            confidence_reasoning: [



              "High multi-domain conflict severity",



            ],



          },



        },







        history: [],



      },







      governance: {



        lifecycle_state:



          "ESCALATED",







        lifecycle_reason:



          "Critical urban condition",



      },







      enforcement: {



        enforcement_id:



          "ENF-1778139637016",







        action:



          "DEPLOY_RESPONSE_UNITS",







        governance_state:



          "ESCALATED",







        approved: false,



      },







      resolution: {



        resolution_status:



          "PENDING_GOVERNANCE",







        feedback_timestamp:



          1778139637016,



      },







      bucket_snapshot: [],







      replay: [],







      ui_evolution: {



        ui_state: "HIGH",



        cluster_state:



          "STABLE_CLUSTER",



        anomaly_visibility: [],



      },



    },



  },



};







/* =========================================================



   CITY RISK MAP



========================================================= */







const COLOR_HEX = {



  orange: COLORS.orange,



  green: COLORS.green,



  red: COLORS.red,



  blue: COLORS.blue,



};







function CityRiskMap({



  centerLabel,



  centerLevel,



  riskPoints,



  pulse,



}) {



  const [



    hoveredPoint,



    setHoveredPoint,



  ] = useState(null);







  const [



    selectedPoint,



    setSelectedPoint,



  ] = useState(null);







  const [



    mapType,



    setMapType,



  ] = useState("streets");







  return (



    <div



      style={{



        position: "relative",



        width: "100%",



        height: "100%",



      }}



    >



      {/* MAP TYPE BUTTONS */}







      <div



        style={{



          position: "absolute",



          top: 12,



          left: 12,



          zIndex: 10,



          background:



            "rgba(0,20,12,0.95)",



          border:



            "1px solid rgba(0,255,156,0.3)",



          borderRadius: 6,



          padding: "8px 12px",



          display: "flex",



          gap: 8,



        }}



      >



        <button



          type="button"



          onClick={() =>



            setMapType("streets")



          }



          style={{



            padding: "6px 12px",



            background:



              mapType === "streets"



                ? COLORS.green



                : "transparent",



            color:



              mapType === "streets"



                ? "#00140c"



                : COLORS.green,



            border:



              `1px solid ${



                mapType === "streets"



                  ? COLORS.green



                  : "rgba(0,255,156,0.5)"



              }`,



            borderRadius: 4,



            cursor: "pointer",



            fontSize: 12,



            fontWeight: 700,



          }}



        >



          Streets



        </button>







        <button



          type="button"



          onClick={() =>



            setMapType("satellite")



          }



          style={{



            padding: "6px 12px",



            background:



              mapType === "satellite"



                ? COLORS.green



                : "transparent",



            color:



              mapType === "satellite"



                ? "#00140c"



                : COLORS.green,



            border:



              `1px solid ${



                mapType === "satellite"



                  ? COLORS.green



                  : "rgba(0,255,156,0.5)"



              }`,



            borderRadius: 4,



            cursor: "pointer",



            fontSize: 12,



            fontWeight: 700,



          }}



        >



          Satellite



        </button>



      </div>







      <svg



        viewBox="0 0 1200 700"



        width="100%"



        height="100%"



        preserveAspectRatio="none"



        style={{



          display: "block",



          background: "#020403",



        }}



      >



        <defs>



          {/* STREET PATTERN */}







          <pattern



            id="streets"



            patternUnits="userSpaceOnUse"



            width="60"



            height="60"



          >



            <rect



              width="60"



              height="60"



              fill="#1a2333"



            />







            <line



              x1="0"



              y1="30"



              x2="60"



              y2="30"



              stroke="#2a3a4a"



              strokeWidth="0.5"



            />







            <line



              x1="30"



              y1="0"



              x2="30"



              y2="60"



              stroke="#2a3a4a"



              strokeWidth="0.5"



            />



          </pattern>







          {/* SATELLITE PATTERN */}







          <pattern



            id="satellite"



            patternUnits="userSpaceOnUse"



            width="40"



            height="40"



          >



            <rect



              width="40"



              height="40"



              fill="#1a3a1a"



            />







            <circle



              cx="10"



              cy="10"



              r="2"



              fill="#2a4a2a"



            />







            <circle



              cx="30"



              cy="25"



              r="1.5"



              fill="#2a4a2a"



            />







            <circle



              cx="15"



              cy="35"



              r="1"



              fill="#2a4a2a"



            />



          </pattern>







          {/* GLOW */}







          <filter



            id="glow"



            x="-80%"



            y="-80%"



            width="260%"



            height="260%"



          >



            <feGaussianBlur



              stdDeviation="8"



              result="blur"



            />







            <feMerge>



              <feMergeNode in="blur" />



              <feMergeNode in="SourceGraphic" />



            </feMerge>



          </filter>



        </defs>







        {/* BACKGROUND */}







        <rect



          width="1200"



          height="700"



          fill={



            mapType === "streets"



              ? "url(#streets)"



              : "url(#satellite)"



          }



        />







        {/* BORDER */}







        <rect



          width="1200"



          height="700"



          fill="none"



          stroke="rgba(0,255,156,0.2)"



          strokeWidth="2"



          rx="10"



        />







        {/* GRID */}







        {mapType === "streets" && (



          <g opacity="0.1">



            {Array.from({



              length: 13,



            }).map((_, i) => (



              <line



                key={`v-${i}`}



                x1={i * 100}



                y1="0"



                x2={i * 100}



                y2="700"



                stroke="#00ff9c"



                strokeWidth="1"



              />



            ))}







            {Array.from({



              length: 8,



            }).map((_, i) => (



              <line



                key={`h-${i}`}



                x1="0"



                y1={i * 100}



                x2="1200"



                y2={i * 100}



                stroke="#00ff9c"



                strokeWidth="1"



              />



            ))}



          </g>



        )}







        {/* CENTER INFO */}







        <g>



          <rect



            x="20"



            y="20"



            width="300"



            height="65"



            rx="8"



            fill="#00140c"



            fillOpacity="0.95"



            stroke="#00ff9c"



            strokeOpacity="0.5"



          />







          <text



            x="35"



            y="43"



            fontSize="13"



            fill="#7fffce"



            fontWeight="700"



          >



            {centerLabel}



          </text>







          <text



            x="35"



            y="66"



            fontSize="14"



            fill="#00ff9c"



            fontWeight="800"



          >



            LEVEL: {centerLevel}



          </text>



        </g>







        {/* RISK POINTS */}







        {riskPoints.map(



          (point, index) => {



            const x =



              150 +



              (index % 2) * 350 +



              Math.sin(index) *



                100;







            const y =



              150 +



              Math.floor(



                index / 2



              ) *



                250 +



              Math.cos(index) *



                80;







            const color =



              COLOR_HEX[



                point.color



              ] ||



              COLORS.green;







            const isHovered =



              hoveredPoint ===



              index;







            const isSelected =



              selectedPoint ===



              index;







            return (



              <g



                key={index}



                onMouseEnter={() =>



                  setHoveredPoint(



                    index



                  )



                }



                onMouseLeave={() =>



                  setHoveredPoint(



                    null



                  )



                }



                onClick={() =>



                  setSelectedPoint(



                    isSelected



                      ? null



                      : index



                  )



                }



                style={{



                  cursor:



                    "pointer",



                }}



              >



                {/* PULSE */}







                {(isHovered ||



                  isSelected ||



                  (index === 0 &&



                    pulse)) && (



                  <circle



                    cx={x}



                    cy={y}



                    r={



                      isHovered ||



                      isSelected



                        ? 45



                        : 35



                    }



                    fill="none"



                    stroke={color}



                    strokeWidth="2"



                    opacity="0.4"



                  >



                    <animate



                      attributeName="r"



                      values={



                        isHovered



                          ? "35;55;35"



                          : "25;45;25"



                      }



                      dur={



                        isHovered



                          ? "1.2s"



                          : "2s"



                      }



                      repeatCount="indefinite"



                    />







                    <animate



                      attributeName="opacity"



                      values="0.6;0.1;0.6"



                      dur={



                        isHovered



                          ? "1.2s"



                          : "2s"



                      }



                      repeatCount="indefinite"



                    />



                  </circle>



                )}







                {/* MAIN MARKER */}







                <circle



                  cx={x}



                  cy={y}



                  r={



                    isHovered ||



                    isSelected



                      ? 20



                      : 15



                  }



                  fill={color}



                  fillOpacity="0.9"



                  stroke={



                    isSelected



                      ? "#ffff00"



                      : "#ffffff"



                  }



                  strokeWidth={



                    isSelected ? 3 : 2



                  }



                  filter="url(#glow)"



                />







                {/* STATUS */}







                <circle



                  cx={x + 30}



                  cy={y - 25}



                  r="17"



                  fill={



                    index === 0



                      ? COLORS.red



                      : index === 2



                      ? COLORS.red



                      : COLORS.orange



                  }



                  stroke="#ffffff"



                  strokeWidth="1.5"



                />







                <text



                  x={x + 30}



                  y={y - 20}



                  textAnchor="middle"



                  fontSize="10"



                  fill="#ffffff"



                  fontWeight="800"



                >



                  {index === 0



                    ? "HIGH"



                    : index === 2



                    ? "ALERT"



                    : "MED"}



                </text>







                {/* LABEL */}







                <text



                  x={x}



                  y={y + 40}



                  textAnchor="middle"



                  fontSize={



                    isHovered ||



                    isSelected



                      ? 13



                      : 12



                  }



                  fill={color}



                  fontWeight="700"



                >



                  {point.label}



                </text>







                {/* POPUP */}







                {(isHovered ||



                  isSelected) && (



                  <g>



                    <rect



                      x={x - 85}



                      y={y - 78}



                      width="170"



                      height="60"



                      rx="6"



                      fill="#00140c"



                      fillOpacity="0.97"



                      stroke={color}



                    />







                    <text



                      x={x}



                      y={y - 57}



                      textAnchor="middle"



                      fontSize="11"



                      fill={color}



                      fontWeight="700"



                    >



                      {point.label}



                    </text>







                    <text



                      x={x}



                      y={y - 40}



                      textAnchor="middle"



                      fontSize="10"



                      fill="#7fffce"



                    >



                      Lat:{" "}



                      {point.position[0].toFixed(



                        3



                      )}



                    </text>







                    <text



                      x={x}



                      y={y - 25}



                      textAnchor="middle"



                      fontSize="10"



                      fill="#7fffce"



                    >



                      Lng:{" "}



                      {point.position[1].toFixed(



                        3



                      )}



                    </text>



                  </g>



                )}



              </g>



            );



          }



        )}







        {/* MAP LEGEND */}







        <g>



          <rect



            x="1040"



            y="20"



            width="140"



            height="120"



            rx="6"



            fill="#00140c"



            fillOpacity="0.95"



            stroke="rgba(0,255,156,0.3)"



          />







          <text



            x="1055"



            y="42"



            fontSize="12"



            fill="#00ff9c"



            fontWeight="800"



          >



            Legend



          </text>







          <circle



            cx="1060"



            cy="63"



            r="4"



            fill={COLORS.orange}



          />







          <text



            x="1075"



            y="67"



            fontSize="11"



            fill="#7fffce"



          >



            Critical



          </text>







          <circle



            cx="1060"



            cy="85"



            r="4"



            fill={COLORS.green}



          />







          <text



            x="1075"



            y="89"



            fontSize="11"



            fill="#7fffce"



          >



            Stable



          </text>







          <circle



            cx="1060"



            cy="107"



            r="4"



            fill={COLORS.red}



          />







          <text



            x="1075"



            y="111"



            fontSize="11"



            fill="#7fffce"



          >



            Alert



          </text>







          <circle



            cx="1060"



            cy="129"



            r="4"



            fill={COLORS.blue}



          />







          <text



            x="1075"



            y="133"



            fontSize="11"



            fill="#7fffce"



          >



            Active



          </text>



        </g>



      </svg>



    </div>



  );



}







/* =========================================================



   MAIN COMPONENT



========================================================= */







function UrbanIntelligence() {



  /* =======================================================



     INTELLIGENCE STATE



  ======================================================= */







  const [



    intelligence,



    setIntelligence,



  ] = useState({



    traceId:



      "TRACE-1778139637014",







    zoneId: 4,







    dominantDomain:



      "complaints",







    finalScore: 120,







    finalLevel: "HIGH",







    trend: "STABLE",







    behavior: "STABLE",







    reason:



      "complaints override activated",







    rainfall: 140,







    stormProbability: 88,







    floodRisk: 95,







    congestion: 82,







    complaints: 120,



  });







  const [



    intelligenceOutput,



    setIntelligenceOutput,



  ] = useState(null);







  const [



    intelligenceSource,



    setIntelligenceSource,



  ] = useState(null);







  const [



    isRunning,



    setIsRunning,



  ] = useState(false);







  /* =======================================================



     LIVE MODE



  ======================================================= */







  const [



    liveMode,



    setLiveMode,



  ] = useState(false);







  const [



    simTick,



    setSimTick,



  ] = useState(0);







  const [



    liveSeries,



    setLiveSeries,



  ] = useState([



    30,



    50,



    70,



    85,



    95,



  ]);







  const liveIntervalRef =



    useRef(null);







  /* =======================================================



     APPLY API DATA



  ======================================================= */







  const applyIntelligenceData =



    useCallback((data) => {



      const current =



        data?.convergence



          ?.flow



          ?.intelligence



          ?.current_state;







      const raw =



        data?.convergence



          ?.flow



          ?.real_signal



          ?.raw_data;







      setIntelligence(



        (previous) => ({



          ...previous,







          traceId:



            data?.convergence



              ?.trace_continuity ??



            previous.traceId,







          zoneId:



            current?.zone_id ??



            previous.zoneId,







          dominantDomain:



            current?.dominant_domain ??



            previous.dominantDomain,







          finalScore:



            current?.final_score ??



            previous.finalScore,







          finalLevel:



            current?.final_level ??



            previous.finalLevel,







          trend:



            current?.trend ??



            previous.trend,







          behavior:



            current?.behavior ??



            previous.behavior,







          reason:



            current?.reason ??



            previous.reason,







          rainfall:



            raw?.weather



              ?.rainfall_mm ??



            previous.rainfall,







          stormProbability:



            raw?.weather



              ?.storm_probability ??



            previous.stormProbability,







          floodRisk:



            raw?.flooding



              ?.flood_risk ??



            previous.floodRisk,







          congestion:



            raw?.traffic



              ?.congestion_index ??



            previous.congestion,







          complaints:



            raw?.complaints



              ?.emergency_complaints ??



            previous.complaints,



        })



      );







      setIntelligenceOutput(



        data



      );



    }, []);







  /* =======================================================



     RUN INTELLIGENCE



  ======================================================= */







  const runIntelligence =



    useCallback(async () => {



      setIsRunning(true);







      try {



        console.log(



          "================================"



        );







        console.log(



          "UCCIS INTELLIGENCE REQUEST"



        );







        console.log(



          "GET:",



          INTELLIGENCE_URL



        );







        console.log(



          "================================"



        );







        const controller =



          new AbortController();







        const timeout =



          setTimeout(



            () =>



              controller.abort(),



            15000



          );







        const response =



          await fetch(



            INTELLIGENCE_URL,



            {



              method: "GET",



              headers: {



                Accept:



                  "application/json",



              },



              signal:



                controller.signal,



            }



          );







        clearTimeout(



          timeout



        );







        if (!response.ok) {



          throw new Error(



            `Backend responded with HTTP ${response.status}`



          );



        }







        const data =



          await response.json();







        if (



          !data ||



          typeof data !==



            "object"



        ) {



          throw new Error(



            "Invalid intelligence response."



          );



        }







        applyIntelligenceData(



          data



        );







        setIntelligenceSource(



          "live"



        );







        console.log(



          "Live intelligence received:",



          data



        );



      } catch (error) {



        console.error(



          "Live intelligence failed:",



          error



        );







        console.log(



          "Using local UCCIS intelligence fallback."



        );







        applyIntelligenceData(



          MOCK_INTELLIGENCE_OUTPUT



        );







        setIntelligenceSource(



          "mock"



        );



      } finally {



        setIsRunning(false);



      }



    }, [



      applyIntelligenceData,



    ]);







  /* =======================================================



     LIVE SIMULATION



  ======================================================= */







  useEffect(() => {



    if (!liveMode) {



      if (



        liveIntervalRef.current



      ) {



        clearInterval(



          liveIntervalRef.current



        );







        liveIntervalRef.current =



          null;



      }







      return undefined;



    }







    liveIntervalRef.current =



      setInterval(() => {



        setSimTick(



          (value) =>



            value + 1



        );







        setLiveSeries(



          (previous) => {



            const last =



              previous[



                previous.length -



                  1



              ];







            const jitter =



              Math.round(



                (Math.random() -



                  0.35) *



                  12



              );







            const next =



              Math.max(



                10,



                Math.min(



                  100,



                  last + jitter



                )



              );







            return [



              ...previous.slice(



                -4



              ),



              next,



            ];



          }



        );







        setIntelligence(



          (previous) => {



            const jitter =



              () =>



                Math.round(



                  (Math.random() -



                    0.5) *



                    6



                );







            return {



              ...previous,







              congestion:



                Math.max(



                  10,



                  Math.min(



                    100,



                    previous.congestion +



                      jitter()



                  )



                ),







              floodRisk:



                Math.max(



                  10,



                  Math.min(



                    100,



                    previous.floodRisk +



                      jitter()



                  )



                ),







              complaints:



                Math.max(



                  10,



                  Math.min(



                    150,



                    previous.complaints +



                      jitter()



                  )



                ),



            };



          }



        );



      }, 2500);







    return () => {



      if (



        liveIntervalRef.current



      ) {



        clearInterval(



          liveIntervalRef.current



        );



      }



    };



  }, [liveMode]);







  /* =======================================================



     CHART OPTIONS



  ======================================================= */







  const chartOptions =



    useMemo(



      () => ({



        responsive: true,







        maintainAspectRatio:



          false,







        interaction: {



          mode: "index",



          intersect: false,



        },







        layout: {



          padding: {



            left: 10,



            right: 20,



            top: 20,



            bottom: 10,



          },



        },







        plugins: {



          legend: {



            labels: {



              color:



                COLORS.green,







              font: {



                size: 13,



                weight: "600",



              },



            },



          },







          tooltip: {



            backgroundColor:



              "#101010",







            titleColor:



              COLORS.green,







            bodyColor:



              "#ffffff",







            borderColor:



              COLORS.green,







            borderWidth: 1,







            padding: 12,



          },



        },







        scales: {



          x: {



            title: {



              display: true,







              text:



                "Time Period",







              color:



                COLORS.green,







              font: {



                size: 14,



                weight: "700",



              },







              padding: 12,



            },







            ticks: {



              color:



                "#d1d5db",







              font: {



                size: 12,



              },



            },







            grid: {



              color:



                "rgba(255,255,255,0.04)",



            },



          },







          y: {



            beginAtZero: true,







            suggestedMax: 100,







            title: {



              display: true,







              text:



                "Risk Score",







              color:



                COLORS.green,







              font: {



                size: 14,



                weight: "700",



              },







              padding: 12,



            },







            ticks: {



              color:



                "#d1d5db",







              font: {



                size: 12,



              },



            },







            grid: {



              color:



                "rgba(255,255,255,0.04)",



            },



          },



        },



      }),



      []



    );







  /* =======================================================



     BAR CHART OPTIONS



  ======================================================= */







  const barChartOptions =



    useMemo(



      () => ({



        responsive: true,







        maintainAspectRatio:



          false,







        layout: {



          padding: {



            left: 10,



            right: 20,



            top: 20,



            bottom: 10,



          },



        },







        plugins: {



          legend: {



            labels: {



              color:



                COLORS.green,







              font: {



                size: 13,



                weight: "600",



              },



            },



          },







          tooltip: {



            backgroundColor:



              "#101010",







            titleColor:



              COLORS.green,







            bodyColor:



              "#ffffff",







            borderColor:



              COLORS.green,







            borderWidth: 1,



          },



        },







        scales: {



          x: {



            title: {



              display: true,







              text:



                "Domain Type",







              color:



                COLORS.green,







              font: {



                size: 14,



                weight: "700",



              },







              padding: 12,



            },







            ticks: {



              color:



                "#d1d5db",







              font: {



                size: 12,



                weight: "600",



              },







              padding: 8,



            },







            grid: {



              color:



                "rgba(255,255,255,0.04)",



            },



          },







          y: {



            beginAtZero: true,







            suggestedMax: 130,







            title: {



              display: true,







              text:



                "Influence Score",







              color:



                COLORS.green,







              font: {



                size: 14,



                weight: "700",



              },







              padding: 12,



            },







            ticks: {



              color:



                "#d1d5db",







              font: {



                size: 12,



              },



            },







            grid: {



              color:



                "rgba(255,255,255,0.04)",



            },



          },



        },



      }),



      []



    );







  /* =======================================================



     DATASETS



  ======================================================= */







  const lineData =



    useMemo(



      () => ({



        labels: [



          "T-4",



          "T-3",



          "T-2",



          "T-1",



          "Now",



        ],







        datasets: [



          {



            label: liveMode



              ? "Zone 4 Risk — Live"



              : "Zone 4 Risk",







            data: liveSeries,







            borderColor:



              liveMode



                ? COLORS.green



                : COLORS.blue,







            backgroundColor:



              liveMode



                ? "rgba(0,255,156,0.15)"



                : "rgba(60,164,232,0.15)",







            pointBackgroundColor:



              liveMode



                ? COLORS.green



                : COLORS.blue,







            pointBorderColor:



              "#ffffff",







            pointRadius: 5,







            borderWidth: 3,







            tension: 0.25,







            fill: true,



          },



        ],



      }),



      [liveMode, liveSeries]



    );







  const barData =



    useMemo(



      () => ({



        labels: [



          "Flooding",



          "Traffic",



          "Water",



          "Waste",



          "Complaints",



        ],







        datasets: [



          {



            label:



              "Domain Scores",







            data: [



              Number(



                intelligence.floodRisk



              ),







              Number(



                intelligence.congestion



              ),







              70,







              45,







              Number(



                intelligence.complaints



              ),



            ],







            backgroundColor: [



              COLORS.red,



              COLORS.blue,



              COLORS.orange,



              COLORS.green,



              COLORS.pink,



            ],







            borderColor:



              "#ffffff",







            borderWidth: 1,







            borderRadius: 5,



          },



        ],



      }),



      [



        intelligence.floodRisk,



        intelligence.congestion,



        intelligence.complaints,



      ]



    );







  const governanceData =



    useMemo(



      () => ({



        labels: [



          "APPROVED",



          "HOLD",



          "RETRY",



          "REJECTED",



        ],







        datasets: [



          {



            data: [



              70,



              10,



              15,



              5,



            ],







            backgroundColor: [



              COLORS.blue,



              COLORS.pink,



              COLORS.orange,



              COLORS.yellow,



            ],







            borderColor:



              "#ffffff",







            borderWidth: 2,



          },



        ],



      }),



      []



    );







  const confidenceData =



    useMemo(



      () => ({



        labels: [



          "Confidence",



          "Uncertainty",



        ],







        datasets: [



          {



            data: [



              88,



              12,



            ],







            backgroundColor: [



              COLORS.blue,



              COLORS.pink,



            ],







            borderColor:



              "#ffffff",







            borderWidth: 2,



          },



        ],



      }),



      []



    );







  const pieOptions =



    useMemo(



      () => ({



        responsive: true,







        maintainAspectRatio:



          false,







        plugins: {



          legend: {



            position:



              "bottom",







            labels: {



              color:



                "#d1d5db",







              font: {



                size: 13,



                weight: "600",



              },







              padding: 15,



            },



          },







          tooltip: {



            backgroundColor:



              "#101010",







            titleColor:



              COLORS.green,







            bodyColor:



              "#ffffff",



          },



        },



      }),



      []



    );







  /* =======================================================



     MAP DATA



  ======================================================= */







  const riskPoints = [



    {



      position: [



        18.5204,



        73.8567,



      ],







      color: "orange",







      label:



        "Complaint escalation",



    },







    {



      position: [



        18.552,



        73.86,



      ],







      color: "green",







      label:



        "Stable civic response",



    },







    {



      position: [



        18.565,



        73.915,



      ],







      color: "red",







      label:



        "Critical flood signal",



    },







    {



      position: [



        18.525,



        73.895,



      ],







      color: "orange",







      label:



        "Traffic congestion",



    },



  ];







  /* =======================================================



     OUTPUT DATA



  ======================================================= */







  const currentState =



    intelligenceOutput



      ?.convergence



      ?.flow



      ?.intelligence



      ?.current_state ||



    null;







  const governanceInfo =



    intelligenceOutput



      ?.convergence



      ?.flow



      ?.governance ||



    null;







  const enforcementInfo =



    intelligenceOutput



      ?.convergence



      ?.flow



      ?.enforcement ||



    null;







  const resolutionInfo =



    intelligenceOutput



      ?.convergence



      ?.flow



      ?.resolution ||



    null;







  const clusterInfo =



    currentState



      ?.cluster_intelligence ||



    null;







  const confidenceInfo =



    currentState?.confidence ||



    null;







  /* =======================================================



     RENDER



  ======================================================= */







  return (



    <div className="uccis-page">







      {/* =================================================



          HEADER



      ================================================= */}







      <header className="uccis-header">







        <div>



          <h1>



            UCCIS — Urban Intelligence



            Command Center



          </h1>







          {/* <div



            style={{



              marginTop: 6,



              color: "#7fffce",



              fontSize: 13,



            }}



          >



            API: {API_URL}



          </div> */}



        </div>







        <div className="header-actions">







          {/* <button



            type="button"



            className={



              `live-toggle ${



                liveMode



                  ? "live-on"



                  : ""



              }`



            }



            onClick={() =>



              setLiveMode(



                (value) =>



                  !value



              )



            }



          >



            {liveMode



              ? `● Live Simulation — Tick ${simTick}`



              : "Start Live Simulation"}



          </button> */}







          <button



            type="button"



            onClick={



              runIntelligence



            }



            disabled={



              isRunning



            }



          >



            {isRunning



              ? "Running..."



              : "Run Intelligence"}



          </button>







        </div>







      </header>







      {/* =================================================



          MAP



      ================================================= */}







      <section className="panel map-panel">







        <h2>



          City Risk Map



        </h2>







        <div className="risk-map">







          <CityRiskMap



            centerLabel={`Trace: ${intelligence.traceId}`}



            centerLevel={



              intelligence.finalLevel



            }



            riskPoints={



              riskPoints



            }



            pulse={



              liveMode



            }



          />







        </div>







      </section>







      {/* =================================================



          CHARTS



      ================================================= */}







      <section className="chart-grid">







        <div className="panel chart-panel">







          <h2>



            Temporal Risk Timeline



          </h2>







          <div className="chart-box">



            <Line



              data={lineData}



              options={



                chartOptions



              }



            />



          </div>







        </div>







        <div className="panel chart-panel">







          <h2>



            Domain Influence Chart



          </h2>







          <div className="chart-box">



            <Bar



              data={barData}



              options={



                barChartOptions



              }



            />



          </div>







        </div>







      </section>







      {/* =================================================



          PIE CHARTS



      ================================================= */}







      <section className="pie-grid">







        <div className="panel pie-panel">







          <h2>



            Governance Lifecycle



          </h2>







          <div className="pie-box">







            <Pie



              data={



                governanceData



              }



              options={



                pieOptions



              }



            />







          </div>







        </div>







        <div className="panel pie-panel">







          <h2>



            Confidence Engine



          </h2>







          <div className="pie-box">







            <Doughnut



              data={



                confidenceData



              }



              options={



                pieOptions



              }



            />







          </div>







        </div>







      </section>







      {/* =================================================



          INTELLIGENCE OUTPUT



      ================================================= */}







      {intelligenceOutput && (

        <section className="panel output-panel">

          <div className="output-panel-header">

            <h2>Intelligence Output</h2>

          </div>



          <div className="output-grid">

            <OutputCard label="Dataset" value="AIS_file.csv" />

            <OutputCard label="Records Analyzed" value="10,000" />

            <OutputCard label="Unique Vessels" value="6,728" />

            <OutputCard label="Observation Window" value="00:00:00 - 00:04:40" sub="2022-01-01" />



            <OutputCard label="Moving Records" value="4,276" sub="42.76% of observations" />

            <OutputCard label="Stationary Records" value="5,724" sub="57.24% of observations" />

            <OutputCard label="Average SOG" value="2.51 kn" sub="Excluding unavailable SOG 102.3" />

            <OutputCard label="Maximum SOG" value="37.4 kn" />



            <OutputCard label="High-Speed Records" value="938" sub="SOG >= 10 knots" />

            <OutputCard label="Unavailable SOG" value="23" sub="AIS sentinel value 102.3" />

            <OutputCard label="Vessel Types" value="57" />

            <OutputCard label="AIS Risk Score / Level" value="78 / HIGH" sub="Rule-based operational risk score" />



            <OutputCard label="Dominant AIS Domain" value="Vessel Activity" />

            <OutputCard

              label="Intelligence Reason"

              value="High vessel concentration with elevated stationary activity"

              sub="57.24% of AIS observations are stationary"

            />

            <OutputCard label="Data Quality" value="99.77%" sub="23 unavailable SOG records out of 10,000" />

            <OutputCard label="Assessment" value="HIGH MARITIME ACTIVITY RISK" sub="Operational intelligence; not an incident probability" />

          </div>



          <div className="propagated-zones">

            <h3>AIS Spatial Hotspots</h3>

            <div className="events">

              <div className="event-row"><strong>Hotspot 1</strong>{" — 47.5-48.0 N, 122.5-122.0 W — 434 records — 340 vessels — 85.94% stationary"}</div>

              <div className="event-row"><strong>Hotspot 2</strong>{" — 29.5-30.0 N, 90.5-90.0 W — 390 records — 247 vessels — 57.69% stationary"}</div>

              <div className="event-row"><strong>Hotspot 3</strong>{" — 29.5-30.0 N, 95.5-95.0 W — 335 records — 208 vessels — 63.28% stationary"}</div>

              <div className="event-row"><strong>Hotspot 4</strong>{" — 33.5-34.0 N, 118.5-118.0 W — 281 records — 212 vessels — 69.40% stationary"}</div>

              <div className="event-row"><strong>Hotspot 5</strong>{" — 40.5-41.0 N, 74.5-74.0 W — 232 records — 136 vessels — 61.21% stationary"}</div>

            </div>

          </div>

        </section>

      )}







      {/* =================================================



          INLINE CSS



      ================================================= */}







      <style>{`







        * {



          box-sizing: border-box;



        }







        body {



          margin: 0;



        }







        .uccis-page {



          min-height: 100vh;



          background: #020403;



          color: #00ff9c;



          padding-bottom: 20px;



          font-family:



            Arial,



            Helvetica,



            sans-serif;



        }







        /* ==============================



           HEADER



        ============================== */







        .uccis-header {



          display: flex;



          justify-content: space-between;



          align-items: center;



          gap: 20px;



          padding: 24px 24px 30px;



          background: #020403;



          flex-wrap: wrap;



        }







        .uccis-header h1 {



          margin: 0;



          font-size: 36px;



          line-height: 1.2;



          font-weight: 800;



          color: #00ff9c;



        }







        .header-actions {



          display: flex;



          gap: 12px;



          flex-wrap: wrap;



        }







        .uccis-header button {



          border: none;



          background: #00ef94;



          color: #00140c;



          font-size: 16px;



          font-weight: 800;



          padding: 14px 22px;



          min-width: 170px;



          cursor: pointer;



          border-radius: 6px;



          transition:



            transform 0.2s ease,



            opacity 0.2s ease;



        }







        .uccis-header button:hover {



          transform: translateY(-1px);



        }







        .uccis-header button:disabled {



          background: #0a7a54;



          color: #063325;



          cursor: not-allowed;



          transform: none;



        }







        .live-toggle {



          background: transparent !important;



          color: #00ff9c !important;



          border: 2px solid #00ff9c !important;



        }







        .live-toggle.live-on {



          background:



            rgba(0,255,156,0.15) !important;







          box-shadow:



            0 0 18px



            rgba(0,255,156,0.5);



        }







        /* ==============================



           PANELS



        ============================== */







        .panel {



          background: #101010;



          border:



            1px solid



            rgba(0,255,156,0.5);







          box-shadow:



            0 0 22px



            rgba(0,255,156,0.25);







          border-radius: 12px;



        }







        .panel h2 {



          color: #00ff9c;



          font-size: 26px;



          margin: 0 0 22px;



          font-weight: 800;



        }







        /* ==============================



           MAP



        ============================== */







        .map-panel {



          margin: 0 20px 20px;



          padding: 28px 22px 22px;



        }







        .risk-map {



          width: 100%;



          height: 460px;



          border-radius: 10px;



          overflow: hidden;



          border:



            1px solid



            rgba(0,255,156,0.2);



        }







        /* ==============================



           CHART GRID



        ============================== */







        .chart-grid {



          display: grid;



          grid-template-columns:



            repeat(2, minmax(0, 1fr));







          gap: 20px;







          margin: 0 20px 20px;



        }







        .chart-panel {



          min-height: 470px;



          padding: 28px 28px 24px;







          display: flex;



          flex-direction: column;



        }







        .chart-box {



          position: relative;



          width: 100%;



          height: 370px;



          min-height: 0;



        }







        /* ==============================



           PIE GRID



        ============================== */







        .pie-grid {



          display: grid;



          grid-template-columns:



            repeat(2, minmax(0, 1fr));







          gap: 20px;







          margin: 0 20px 20px;



        }







        .pie-panel {



          height: 390px;



          padding: 28px 28px 20px;



          text-align: center;



        }







        .pie-panel h2 {



          text-align: center;



        }







        .pie-box {



          position: relative;



          height: 285px;



        }







        /* ==============================



           OUTPUT



        ============================== */







        .output-panel {



          margin: 0 20px 20px;



          padding: 30px;



        }







        .output-panel-header {



          display: flex;



          align-items: center;



          justify-content: space-between;



          gap: 16px;



          margin-bottom: 22px;



        }







        .output-panel-header h2 {



          margin: 0;



        }







        .source-badge {



          font-size: 12px;



          font-weight: 800;



          padding: 7px 14px;



          border-radius: 20px;



          letter-spacing: 0.5px;



          white-space: nowrap;



        }







        .source-live {



          background:



            rgba(0,255,156,0.15);







          color: #00ff9c;







          border:



            1px solid



            #00ff9c;



        }







        .source-mock {



          background:



            rgba(255,159,59,0.15);







          color: #ff9f3b;







          border:



            1px solid



            #ff9f3b;



        }







        .output-grid {



          display: grid;







          grid-template-columns:



            repeat(



              auto-fit,



              minmax(220px, 1fr)



            );







          gap: 15px;







          margin-bottom: 25px;



        }







        .output-card {



          background: #181818;







          border:



            1px solid



            rgba(0,255,156,0.25);







          border-radius: 10px;







          padding: 15px;







          display: flex;



          flex-direction: column;







          gap: 5px;







          min-height: 85px;



        }







        .output-label {



          font-size: 12px;



          color: #7fffce;



          text-transform: uppercase;



          letter-spacing: 0.5px;



        }







        .output-value {



          font-size: 18px;



          font-weight: 700;



          color: #00ff9c;



          word-break: break-word;



        }







        .output-sub {



          font-size: 12px;



          color: #6fd9ae;



        }







        /* ==============================



           PROPAGATED ZONES



        ============================== */







        .propagated-zones h3 {



          color: #00ff9c;



          font-size: 20px;



          margin: 0 0 12px;



        }







        .events {



          display: flex;



          flex-direction: column;



          gap: 8px;



        }







        .event-row {



          background: #181818;



          border:



            1px solid



            rgba(0,255,156,0.2);







          border-radius: 8px;



          padding: 12px 14px;







          color: #d7fff0;



          font-size: 13px;



        }







        /* ==============================



           MOBILE



        ============================== */







        @media (max-width: 1000px) {







          .chart-grid,



          .pie-grid {



            grid-template-columns: 1fr;



          }







          .uccis-header h1 {



            font-size: 30px;



          }







          .risk-map {



            height: 360px;



          }







        }







        @media (max-width: 650px) {







          .uccis-header {



            padding: 18px;



            align-items: stretch;



          }







          .uccis-header h1 {



            font-size: 25px;



          }







          .header-actions {



            flex-direction: column;



          }







          .uccis-header button {



            width: 100%;



            min-width: 0;



          }







          .map-panel,



          .output-panel {



            margin-left: 10px;



            margin-right: 10px;



          }







          .chart-grid,



          .pie-grid {



            margin-left: 10px;



            margin-right: 10px;



          }







          .chart-panel {



            min-height: 400px;



            padding: 22px;



          }







          .chart-box {



            height: 300px;



          }







          .pie-panel {



            height: 350px;



          }







          .pie-box {



            height: 245px;



          }







          .risk-map {



            height: 300px;



          }







          .output-panel {



            padding: 20px;



          }







          .output-panel-header {



            align-items: flex-start;



            flex-direction: column;



          }







        }







      `}</style>



    </div>



  );



}







/* =========================================================



   OUTPUT CARD



========================================================= */







function OutputCard({



  label,



  value,



  sub,



}) {



  return (



    <div className="output-card">







      <span className="output-label">



        {label}



      </span>







      <span className="output-value">



        {value ?? "—"}



      </span>







      {sub && (



        <span className="output-sub">



          {sub}



        </span>



      )}







    </div>



  );



}







export default UrbanIntelligence;
