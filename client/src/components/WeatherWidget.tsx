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
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    refetchInterval: 1800000, // Atualiza a cada 30 minutos
  });

  if (isLoading) {
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
    return null;
  }

  const temp = Math.round(weather.main.temp);
  const condition = weather.weather[0].main;
  const description = weather.weather[0].description;

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
