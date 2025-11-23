import { useNavigate } from 'react-router';
import { useWeather } from '../context/WeatherContext';
import WeatherInsights from '../features/Insights/weatherInsights';
import WeatherPlan from '../features/Insights/WeatherPlan';
import Button from '../ui/Button';
import Error from '../ui/Error';
import ThreeDotsWave from '../ui/ThreeDotsLoader';
import { IoIosArrowRoundBack } from 'react-icons/io';

function Insights() {
  const { loading, error } = useWeather();
  const navigate = useNavigate();

  const handleBack = function () {
    navigate(-1);
  };

  if (loading) {
    return <ThreeDotsWave />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="secondary"
        size="small"
        className="w-20"
        onClick={handleBack}
      >
        <IoIosArrowRoundBack />
        <span>Back</span>
      </Button>
      <WeatherInsights />
      <WeatherPlan />
    </div>
  );
}

export default Insights;
