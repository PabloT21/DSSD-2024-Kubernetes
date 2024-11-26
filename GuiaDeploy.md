# Guía de Despliegue - Servicio de Sorteos

## Prerequisitos
- Kubectl instalado y configurado
- Acceso a un cluster de Kubernetes
- Docker instalado (para pruebas locales)

## Pasos para el Despliegue

### 1.Levantar un cluster de Kubernetes con Minikube
minikube start


### 2. Verificar acceso al cluster
```bash
kubectl cluster-info
```

### 3. Crear los recursos en Kubernetes

# Aplicar la configuración de Kubernetes
kubectl apply -f kubernetes-configs.yaml


### 4. Activar Metrics API (Para trackear el 60% de utilización de CPU)
```bash
minikube addons enable metrics-server
```

### 5. Verificar el despliegue
```bash
# Verificar que el deployment se creó correctamente
kubectl get deployments

# Verificar que los pods están corriendo
kubectl get pods

# Verificar que el HPA está configurado
kubectl get hpa

# Verificar que el servicio está expuesto
kubectl get services
```

### 6. Obtener la URL del servicio
```bash
minikube ip
```
La IP externa (EXTERNAL-IP) es la dirección para acceder al servicio.

### 7. Monitoreo y Logs
```bash
# Ver logs de los pods
kubectl logs -l app=sorteos-app

# Ver detalles del HPA
kubectl describe hpa sorteos-app-hpa

# Monitorear el escalado
kubectl get hpa sorteos-app-hpa --watch
```

## Verificación del Servicio

1. **Probar el endpoint de salud:**
```bash
curl http://<EXTERNAL-IP>:31220/health
```

2. **Probar el servicio de sorteos:**
```bash
curl -X POST http://<EXTERNAL-IP>:31220/api/lottery/token \
  -H "Content-Type: application/json" \
  -d '{"collectionPointId": "PUNTO001"}'
```

## Características Importantes del Despliegue

- **Replicas**: Mínimo 2 réplicas siempre activas, y máximo 5
- **Autoescalado**: Se escala automáticamente al alcanzar 60% de CPU
- **Health Checks**: Monitoreo continuo de la salud del servicio
- **Load Balancing**: Distribución equitativa de carga entre pods

## Troubleshooting

Si hay problemas con el despliegue:

1. Verificar estado de los pods:
```bash
kubectl describe pod <nombre-del-pod>
```

2. Verificar logs del servicio:
```bash
kubectl logs -l app=sorteos-app
```

3. Verificar eventos del cluster:
```bash
kubectl get events --sort-by=.metadata.creationTimestamp
```
