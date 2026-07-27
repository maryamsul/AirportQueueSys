FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
WORKDIR /app


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SmartAirport.Worker/SmartAirport.Worker.csproj", "SmartAirport.Worker/"]

RUN dotnet restore "SmartAirport.Worker/SmartAirport.Worker.csproj"

COPY . .

WORKDIR "/src/SmartAirport.Worker"

RUN dotnet build -c Release -o /app/build


FROM build AS publish

RUN dotnet publish -c Release -o /app/publish


FROM base AS final

WORKDIR /app

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet","SmartAirport.Worker.dll"]