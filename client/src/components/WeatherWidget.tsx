import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, CloudRain, Snowflake, MapPin } from "lucide-react";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clouds':
      return <Cloud className="h-6 w-6" />;
    case 'clear':
      return <Sun className="h-6 w-6" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain className="h-6 w-6" />;
    case 'snow':
      return <Snowflake className="h-6 w-6" />;
    default:
      return <Cloud className="h-6 w-6" />;
  }
};

export const WeatherWidget = () => {
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['/api/weather'],
    staleTime: 300000, // 5 minutes
    refetchOnMount: true
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mt-2 h-8 w-16" />
        <Skeleton className="mt-1 h-4 w-32" />
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar a previsão do tempo
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{weather.name}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{Math.round(weather.main.temp)}°</span>
            <span className="text-sm text-muted-foreground">C</span>
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {weather.weather[0].description}
          </p>
        </div>
        <div className="text-primary">
          {getWeatherIcon(weather.weather[0].main)}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div>
          Sensação: {Math.round(weather.main.feels_like)}°C
        </div>
        <div>
          Umidade: {weather.main.humidity}%
        </div>
      </div>
    </Card>
  );
};