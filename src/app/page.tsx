"use client";

import { Button } from "@mui/material";
import { Card, CardContent, MenuItem, Select } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Head from "next/head";

const translations: Record<string, { title: string; calculate: string }> = {
  en: {
    title: "ASB Dividend Calculator - Calculate Your ASB Investment Growth",
    calculate: "Calculate",
  },
  ms: {
    title: "Kalkulator Dividen ASB - Kira Pertumbuhan Pelaburan ASB Anda",
    calculate: "Kira",
  },
};

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface YearlyResult {
  year: number;
  totalWealth: string;
}

export default function ASBDividendCalculator() {
  const [balance, setBalance] = useState<number>(50000);
  const [bonusRate, setBonusRate] = useState<number>(0.5);
  const [dividendRate, setDividendRate] = useState<number>(5);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(1);
  const [language, setLanguage] = useState("ms");
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(0);
  const [yearlyResults, setYearlyResults] = useState<YearlyResult[]>([]);

  function calculateASBDividend() {
    if (balance <= 0 || dividendRate < 0 || bonusRate < 0 || investmentPeriod <= 0) return;

    let currentBalance = balance;
    const maxBonusBalance = 30000;
    const months = 12;
    const results: YearlyResult[] = [];

    for (let year = 1; year <= investmentPeriod; year++) {
      let totalDividend = 0;
      let totalBonus = 0;

      for (let month = 0; month < months; month++) {
        const monthlyDividend = (currentBalance * (dividendRate / 100)) / 12;
        const bonusBalance = Math.min(currentBalance, maxBonusBalance);
        const monthlyBonus = (bonusBalance * (bonusRate / 100)) / 12;

        totalDividend += monthlyDividend;
        totalBonus += monthlyBonus;

        currentBalance += monthlyDeposit;
      }

      currentBalance += totalDividend + totalBonus;
      results.push({ year, totalWealth: currentBalance.toFixed(2) });
    }

    setYearlyResults(results);
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "ms";
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    localStorage.setItem("lang", lang);
    setLanguage(lang);
  };

  const chartData = {
    labels: yearlyResults.map((result) => result.year.toString()),
    datasets: [
      {
        label: "Total Wealth (RM)",
        data: yearlyResults.map((result) => parseFloat(result.totalWealth)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{translations[language].title}</title>
        <meta name="description" content="Use this ASB dividend calculator to estimate your returns with monthly deposits, investment periods, and dividend rates." />
        <meta name="keywords" content="ASB, dividend calculator, investment, finance, Malaysia, passive income" />
        <meta name="author" content="Muhammad Mustaqim" />
        <meta property="og:title" content={translations[language].title} />
        <meta property="og:description" content="Calculate your ASB investment growth over the years." />
        <meta property="og:url" content="https://taqim2708.github.io/asb-dividen-calculator/" />
        <meta property="og:image" content="https://taqim2708.github.io/asb-dividen-calculator/og-image.webp" />
      </Head>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4 md:p-10">
        <Card className="p-6 w-full max-w-md md:max-w-lg bg-white shadow-lg rounded-lg">
          <CardContent>
            <h2 className="text-xl font-bold mb-4 text-center">{translations[language].title}</h2>
            <div className="mb-4 text-center">
              <Select value={language} onChange={(e) => changeLanguage(e.target.value)} fullWidth>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ms">Bahasa Melayu</MenuItem>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 font-medium">Initial Investment Amount (RM):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded mb-4"
                  value={balance}
                  min="0"
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                />
                <label className="block mb-2 font-medium">Monthly Deposit (RM):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded mb-4"
                  value={monthlyDeposit}
                  min="0"
                  onChange={(e) => setMonthlyDeposit(parseFloat(e.target.value) || 0)}
                />
                <label className="block mb-2 font-medium">Investment Period (Years):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded mb-4"
                  value={investmentPeriod}
                  min="1"
                  onChange={(e) => setInvestmentPeriod(parseFloat(e.target.value) || 1)}
                />
                <label className="block mb-2 font-medium">Dividend Rate (%):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded mb-4"
                  value={dividendRate}
                  min="0"
                  onChange={(e) => setDividendRate(parseFloat(e.target.value) || 0)}
                />

                <label className="block mb-2 font-medium">Bonus Rate (%):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded mb-4"
                  value={bonusRate}
                  min="0"
                  onChange={(e) => setBonusRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <Button variant="contained" color="primary" fullWidth onClick={calculateASBDividend}>
              {translations[language].calculate}
            </Button>
          </CardContent>
        </Card>
        {yearlyResults.length > 0 && (
          <Card className="mt-6 md:mt-0 md:ml-6 p-4 bg-white shadow-lg rounded-lg w-full md:max-w-lg">
            <h3 className="text-lg font-bold mb-2 text-center">Total Wealth Over the Years</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Year</th>
                    <th className="border border-gray-300 p-2">Total Wealth (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyResults.map((result) => (
                    <tr key={result.year}>
                      <td className="border border-gray-300 p-2">{result.year}</td>
                      <td className="border border-gray-300 p-2">{result.totalWealth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Line data={chartData} className="w-full h-auto" />
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
