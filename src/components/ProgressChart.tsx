import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Skill } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  skills: Skill[];
}

const ProgressChart = ({ skills }: ProgressChartProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Skills Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Progress (%)',
        },
      },
    },
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'rgba(76, 181, 174, 0.7)';
      case 'intermediate':
        return 'rgba(74, 111, 165, 0.7)';
      case 'advanced':
        return 'rgba(22, 96, 136, 0.7)';
      default:
        return 'rgba(74, 111, 165, 0.7)';
    }
  };

  const data = {
    labels: skills.map(skill => skill.name),
    datasets: [
      {
        label: 'Progress',
        data: skills.map(skill => skill.progress),
        backgroundColor: skills.map(skill => getLevelColor(skill.level)),
        borderColor: skills.map(skill => getLevelColor(skill.level).replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Bar options={options} data={data} />
    </div>
  );
};

export default ProgressChart;