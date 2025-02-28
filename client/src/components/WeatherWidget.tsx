import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clouds':
      return <Cloud className="h-8 w-8" />;
    case 'clear':
      return <Sun className="h-8 w-8" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain className="h-8 w-8" />;
    case 'snow':
      return <Snowflake className="h-8 w-8" />;
    default:
      return <Cloud className="h-8 w-8" />;
  }
};

export const WeatherWidget = () => {
  console.log('WeatherWidget: Component mounting'); // Debug log

  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    retry: 1,
    onError: (error) => {
      console.error('WeatherWidget: Error fetching data:', error);
    },
    onSuccess: (data) => {
      console.log('WeatherWidget: Data received:', data);
    },
  });

  if (isLoading) {
    console.log('WeatherWidget: Loading state');
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-32" />
      </Card>
    );
  }

  if (error || !weather) {
    console.error('WeatherWidget: Rendering error state:', error);
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar a previsão do tempo
        </p>
      </Card>
    );
  }

  const temp = Math.round(weather.main.temp);
  const condition = weather.weather[0].main;
  const description = weather.weather[0].description;

  console.log('WeatherWidget: Rendering with data:', { temp, condition, description });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{temp}°C</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {description}
          </p>
        </div>
        {getWeatherIcon(condition)}
      </div>
    </Card>
  );
};