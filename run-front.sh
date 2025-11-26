COMPOSE_FILE="docker-compose.yml"

echo "Comprobando si Docker está corriendo..."

if ! docker info >/dev/null 2>&1; then
  echo "Docker no está en ejecución. Inícialo antes de continuar."
  exit 1
fi

case "$1" in
  build)
    echo "Iniciando contenedores Docker..."
    docker compose -f "$COMPOSE_FILE" up -d --build
    echo "Contenedores levantados correctamente."
    ;;

  start)
    echo "Iniciando contenedores Docker..."
    docker compose -f "$COMPOSE_FILE" up -d
    echo "Contenedores levantados correctamente."
    ;;
  
  stop)
    echo "Deteniendo contenedores Docker..."
    docker compose -f "$COMPOSE_FILE" down
    echo "Contenedores detenidos correctamente."
    ;;
  
  restart)
    echo "Reiniciando contenedores Docker..."
    docker compose -f "$COMPOSE_FILE" down
    docker compose -f "$COMPOSE_FILE" up -d
    echo "Contenedores reiniciados correctamente."
    ;;
  
  *)
    echo "Uso: $0 {build|start|stop|restart}"
    exit 1
    ;;
esac