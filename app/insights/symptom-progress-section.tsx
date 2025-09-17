import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import { BarChart2, Activity, AlertTriangle, ChevronDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSymptomData } from "@/app/insights/symptom-data";
import { InterpretationModal } from "@/app/components/insights/interpretation-dialog";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register all required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export const SymptomProgressSection = () => {
  const router = useRouter();
  const { scores, gad7Scores, error } = useSymptomData();
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1e543b",
        bodyColor: "#1e543b",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          stepSize: 5,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
  };

  const gad7ChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        max: 20,
        ticks: {
          ...chartOptions.scales.y.ticks,
          stepSize: 4,
        },
      },
      x: {
        ...chartOptions.scales.x,
        ticks: {
          ...chartOptions.scales.x.ticks,
          maxTicksLimit: 8,
        },
      },
    },
  };

  // Format the date for chart labels more concisely to prevent overflow
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare chart data
  const chartData = scores
    ? {
        labels: [...scores]
          .reverse()
          .map((score) => formatDate(score.created_at)),
        datasets: [
          {
            label: "Total Score",
            data: [...scores].reverse().map((score) => score.total_score),
            borderColor: "#349934",
            backgroundColor: "rgba(52, 153, 52, 0.1)",
            fill: true,
            tension: 0.2,
            borderWidth: 2,
            pointRadius: 4,
          },
          {
            label: "Obsessive Score",
            data: [...scores].reverse().map((score) => score.obsessive_score),
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            fill: true,
            tension: 0.2,
            borderWidth: 2,
            pointRadius: 4,
          },
          {
            label: "Compulsive Score",
            data: [...scores].reverse().map((score) => score.compulsive_score),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            fill: true,
            tension: 0.2,
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      }
    : null;

  const gad7ChartData = gad7Scores
    ? {
        labels: [...gad7Scores]
          .reverse()
          .map((score) => formatDate(score.created_at)),
        datasets: [
          {
            label: "Anxiety Score",
            data: [...gad7Scores].reverse().map((score) => score.score),
            borderColor: "#fd992d",
            backgroundColor: "rgba(253, 153, 45, 0.1)",
            fill: true,
            tension: 0.2,
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      }
    : null;

  // Calculate current severity levels based on the score ranges from clinical guidelines
  const getYBOCSSeverity = () => {
    if (!scores || scores.length === 0) return { level: "Mild", value: 33 };
    const latestScore = scores[0].total_score;

    // Using the exact YBOCS ranges
    if (latestScore <= 7)
      return {
        level: "Subclinical OCD symptoms",
        value: (latestScore / 40) * 100,
      };
    if (latestScore <= 15)
      return { level: "Mild OCD", value: (latestScore / 40) * 100 };
    if (latestScore <= 23)
      return { level: "Moderate OCD", value: (latestScore / 40) * 100 };
    if (latestScore <= 31)
      return { level: "Severe OCD", value: (latestScore / 40) * 100 };
    return { level: "Extreme OCD", value: (latestScore / 40) * 100 };
  };

  const getAnxietySeverity = () => {
    if (!gad7Scores || gad7Scores.length === 0)
      return { level: "Minimal anxiety", value: 25 };
    const latestScore = gad7Scores[0].score;

    // Using the exact GAD7 ranges
    if (latestScore <= 4)
      return { level: "Minimal anxiety", value: (latestScore / 21) * 100 };
    if (latestScore <= 9)
      return { level: "Mild anxiety", value: (latestScore / 21) * 100 };
    if (latestScore <= 14)
      return { level: "Moderate anxiety", value: (latestScore / 21) * 100 };
    return { level: "Severe anxiety", value: (latestScore / 21) * 100 };
  };

  const ybocsSeverity = getYBOCSSeverity();
  const anxietySeverity = getAnxietySeverity();

  const getCurrentYBOCS = () => {
    if (!scores || scores.length === 0) return 0;
    return scores[0].total_score;
  };

  const getCurrentAnxiety = () => {
    if (!gad7Scores || gad7Scores.length === 0) return 0;
    return gad7Scores[0].score;
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1e543b] flex items-center mb-4">
        <BarChart2 className="h-5 w-5 mr-2 text-[#349934]" />
        Reading Self-Assessments
      </h2>

      <div className="max-w-[800px] mx-auto space-y-4">
        {/* Severity Level Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Card className="bg-white shadow-md border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-[#1e543b] text-white p-3 text-center">
                <p className="text-xs font-medium">OCD Level</p>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-[#1e543b]">
                  {getCurrentYBOCS()}
                </div>
                <div className="text-sm text-[#349934] mt-1">
                  {ybocsSeverity.level}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-[#349934] text-white p-3 text-center">
                <p className="text-xs font-medium">Anxiety Level</p>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-[#1e543b]">
                  {getCurrentAnxiety()}
                </div>
                <div className="text-sm text-[#349934] mt-1">
                  {anxietySeverity.level}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-bold text-[#1e543b] flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-[#349934]" />
          OCD Progress
        </h3>

        <Card className="bg-white shadow-md border-none p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                <span className="text-xs text-[#1e543b]">Obsessive Score</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
                <span className="text-xs text-[#1e543b]">Compulsive Score</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#349934]"></div>
                <span className="text-xs text-[#1e543b]">Total Score</span>
              </div>
            </div>

            <div className="h-[180px] w-full">
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>

            <div className="flex justify-between items-center mt-3">
              <InterpretationModal
                trigger={
                  <span className="text-xs text-[#349934] hover:underline cursor-pointer">
                    How to interpret?
                  </span>
                }
                type="ybocs"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-[#349934] text-[#349934] hover:bg-[#349934]/10 hover:text-[#1e543b]"
                onClick={() => router.push("/assessments/ybocs")}
              >
                Update Score
              </Button>
            </div>
          </div>
        </Card>

        <h3 className="text-lg font-bold text-[#1e543b] flex items-center">
          <Activity className="h-5 w-5 mr-2 text-[#349934]" />
          Anxiety Progress
        </h3>

        <Card className="bg-white shadow-md border-none p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#fd992d]"></div>
                <span className="text-xs text-[#1e543b]">Anxiety Score</span>
              </div>
            </div>

            <div className="h-[180px] w-full">
              {gad7ChartData && (
                <Line data={gad7ChartData} options={gad7ChartOptions} />
              )}
            </div>

            <div className="flex justify-between items-center mt-3">
              <InterpretationModal
                trigger={
                  <span className="text-xs text-[#349934] hover:underline cursor-pointer">
                    How to interpret?
                  </span>
                }
                type="gad7"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-[#349934] text-[#349934] hover:bg-[#349934]/10 hover:text-[#1e543b]"
                onClick={() => router.push("/assessments/gad7")}
              >
                Update Score
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
