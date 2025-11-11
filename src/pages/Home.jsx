import * as motion from 'motion/react-client';
import SearchLocation from '../features/Home/SearchLocation';
import WeatherCurrent from '../features/Home/WeatherCurrent';
import { useWeather } from '../context/WeatherContext';
import Error from '../ui/Error';

function Home() {
  const { error } = useWeather();

  const headline = ' How’s the sky looking today?';
  const letters = headline.split(' ');

  if (error) {
    return <Error />;
  }

  return (
    <main>
      <section>
        <div className="text-center  my-12">
          {letters.map((letter, index) => (
            <motion.h1
              initial={{ filter: 'blur(10px)', opacity: 0, y: 12 }}
              animate={{ filter: 'blur(0)', opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              key={index}
              className="text-6xl md:text-13 inline-block mr-4"
            >
              {letter}
            </motion.h1>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          <SearchLocation />
          <WeatherCurrent />
        </div>
      </section>
    </main>
  );
}

export default Home;
