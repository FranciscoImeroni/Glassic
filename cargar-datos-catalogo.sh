#!/bin/bash

# Script para cargar datos del catálogo en Glassic
# Uso: ./cargar-datos-catalogo.sh [production]
# Ejemplos:
#   ./cargar-datos-catalogo.sh           # Usa localhost
#   ./cargar-datos-catalogo.sh production # Usa producción

if [ "$1" == "production" ]; then
  API_URL="https://glassic-production.up.railway.app/api"
  echo "Usando ambiente de PRODUCCIÓN: $API_URL"
else
  API_URL="http://localhost:3000/api"
  echo "Usando ambiente LOCAL: $API_URL"
fi

echo "======================================"
echo "Cargando datos del catálogo Glassic"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paso 1: Crear Variables
echo -e "${YELLOW}[1/3] Creando Variables...${NC}"
echo ""

curl -X POST "${API_URL}/variables" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "VAN0", "nombre": "Vano 0"}' \
  && echo -e "${GREEN}✓ Variable VAN0 creada${NC}" || echo "✗ Error creando VAN0"

curl -X POST "${API_URL}/variables" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "ALT1", "nombre": "Altura 1"}' \
  && echo -e "${GREEN}✓ Variable ALT1 creada${NC}" || echo "✗ Error creando ALT1"

curl -X POST "${API_URL}/variables" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "VANO1", "nombre": "Vano 1"}' \
  && echo -e "${GREEN}✓ Variable VANO1 creada${NC}" || echo "✗ Error creando VANO1"

curl -X POST "${API_URL}/variables" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "VANO2", "nombre": "Vano 2"}' \
  && echo -e "${GREEN}✓ Variable VANO2 creada${NC}" || echo "✗ Error creando VANO2"

curl -X POST "${API_URL}/variables" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "PAF1", "nombre": "Paño Fijo 1"}' \
  && echo -e "${GREEN}✓ Variable PAF1 creada${NC}" || echo "✗ Error creando PAF1"

echo ""
echo -e "${YELLOW}[2/3] Creando Códigos de Instrucción...${NC}"
echo ""

# Paso 2: Crear Códigos de Instrucción
curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1001", "instruccion": "Instrucción para código 1001"}' \
  && echo -e "${GREEN}✓ Código 1001 creado${NC}" || echo "✗ Error creando 1001"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1002", "instruccion": "Instrucción para código 1002"}' \
  && echo -e "${GREEN}✓ Código 1002 creado${NC}" || echo "✗ Error creando 1002"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1003", "instruccion": "Instrucción para código 1003"}' \
  && echo -e "${GREEN}✓ Código 1003 creado${NC}" || echo "✗ Error creando 1003"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1004", "instruccion": "Instrucción para código 1004"}' \
  && echo -e "${GREEN}✓ Código 1004 creado${NC}" || echo "✗ Error creando 1004"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1005", "instruccion": "Instrucción para código 1005"}' \
  && echo -e "${GREEN}✓ Código 1005 creado${NC}" || echo "✗ Error creando 1005"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1006", "instruccion": "Instrucción para código 1006"}' \
  && echo -e "${GREEN}✓ Código 1006 creado${NC}" || echo "✗ Error creando 1006"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1007", "instruccion": "Instrucción para código 1007"}' \
  && echo -e "${GREEN}✓ Código 1007 creado${NC}" || echo "✗ Error creando 1007"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1008", "instruccion": "Instrucción para código 1008"}' \
  && echo -e "${GREEN}✓ Código 1008 creado${NC}" || echo "✗ Error creando 1008"

curl -X POST "${API_URL}/codigos-instruccion" \
  -H "Content-Type: application/json" \
  -d '{"codigo": "1010", "instruccion": "Instrucción para código 1010"}' \
  && echo -e "${GREEN}✓ Código 1010 creado${NC}" || echo "✗ Error creando 1010"

echo ""
echo -e "${YELLOW}[3/3] Creando Productos...${NC}"
echo ""

# Paso 3: Crear Productos

# Linea 1000 - Panel
curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 1000",
    "serie": "Panel",
    "modelo": "1000",
    "varVi": "VAN0,ALT1",
    "codIvi": "1001.1002",
    "espVidrio": 8,
    "imagen": "IM-1000",
    "esquema": "ES-1000",
    "plano": "PL-1000"
  }' && echo -e "${GREEN}✓ Producto 1000 creado${NC}" || echo "✗ Error creando 1000"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 1000",
    "serie": "Panel",
    "modelo": "1010-i",
    "varVi": "VAN0,ALT1",
    "codIvi": "1001.1002",
    "espVidrio": 8,
    "imagen": "IM-1010-i",
    "esquema": "ES-1010-i",
    "plano": "PL-1010-i"
  }' && echo -e "${GREEN}✓ Producto 1010-i creado${NC}" || echo "✗ Error creando 1010-i"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 1000",
    "serie": "Panel",
    "modelo": "1010-d",
    "varVi": "VAN0,ALT1",
    "codIvi": "1001.1002",
    "espVidrio": 8,
    "imagen": "IM-1010-d",
    "esquema": "ES-1010-d",
    "plano": "PL-1010-d"
  }' && echo -e "${GREEN}✓ Producto 1010-d creado${NC}" || echo "✗ Error creando 1010-d"

# Linea 1000 - Panel Angulo
curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 1000",
    "serie": "Panel Angulo",
    "modelo": "1200-i",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1002",
    "espVidrio": 8,
    "imagen": "IM-1200-i",
    "esquema": "ES-1200-i",
    "plano": "PL-1200-i"
  }' && echo -e "${GREEN}✓ Producto 1200-i creado${NC}" || echo "✗ Error creando 1200-i"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 1000",
    "serie": "Panel Angulo",
    "modelo": "1200-d",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1002",
    "espVidrio": 8,
    "imagen": "IM-1200-d",
    "esquema": "ES-1200-d",
    "plano": "PL-1200-d"
  }' && echo -e "${GREEN}✓ Producto 1200-d creado${NC}" || echo "✗ Error creando 1200-d"

# Linea 4000 - Box Frontal
curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-Ai",
    "varVi": "VAN0,ALT1",
    "codIvi": "1004.1003",
    "espVidrio": 8,
    "imagen": "IM-4000-Ai",
    "esquema": "ES-4000-Ai",
    "plano": "PL-4000-Ai"
  }' && echo -e "${GREEN}✓ Producto 4000-Ai creado${NC}" || echo "✗ Error creando 4000-Ai"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-Ad",
    "varVi": "VAN0,ALT1",
    "codIvi": "1004.1003",
    "espVidrio": 8,
    "imagen": "IM-4000-Ad",
    "esquema": "ES-4000-Ad",
    "plano": "PL-4000-Ad"
  }' && echo -e "${GREEN}✓ Producto 4000-Ad creado${NC}" || echo "✗ Error creando 4000-Ad"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-Bi",
    "varVi": "VAN0,ALT1",
    "codIvi": "1006.1003",
    "espVidrio": 8,
    "imagen": "IM-4000-Bi",
    "esquema": "ES-4000-Bi",
    "plano": "PL-4000-Bi"
  }' && echo -e "${GREEN}✓ Producto 4000-Bi creado${NC}" || echo "✗ Error creando 4000-Bi"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-Bd",
    "varVi": "VAN0,ALT1",
    "codIvi": "1006.1003",
    "espVidrio": 8,
    "imagen": "IM-4000-Bd",
    "esquema": "ES-4000-Bd",
    "plano": "PL-4000-Bd"
  }' && echo -e "${GREEN}✓ Producto 4000-Bd creado${NC}" || echo "✗ Error creando 4000-Bd"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-Ci",
    "varVi": "VAN0,ALT1,PAF1",
    "codIvi": "1005,1003,1010",
    "espVidrio": 8,
    "imagen": "IM-4000-Ci",
    "esquema": "ES-4000-Ci",
    "plano": "PL-4000-Ci"
  }' && echo -e "${GREEN}✓ Producto 4000-Ci creado${NC}" || echo "✗ Error creando 4000-Ci"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-Cd",
    "varVi": "VAN0,ALT1,PAF1",
    "codIvi": "1005,1003,1010",
    "espVidrio": 8,
    "imagen": "IM-4000-Cd",
    "esquema": "ES-4000-Cd",
    "plano": "PL-4000-Cd"
  }' && echo -e "${GREEN}✓ Producto 4000-Cd creado${NC}" || echo "✗ Error creando 4000-Cd"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Frontal",
    "modelo": "4000-D",
    "varVi": "VAN0,ALT1",
    "codIvi": "1007.1003",
    "espVidrio": 8,
    "imagen": "IM-4000-D",
    "esquema": "ES-4000-D",
    "plano": "PL-4000-D"
  }' && echo -e "${GREEN}✓ Producto 4000-D creado${NC}" || echo "✗ Error creando 4000-D"

# Linea 4000 - Box Esquinero
curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Esquinero",
    "modelo": "4100",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4100",
    "esquema": "ES-4100",
    "plano": "PL-4100"
  }' && echo -e "${GREEN}✓ Producto 4100 creado${NC}" || echo "✗ Error creando 4100"

# Linea 4000 - Box Angular
curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-A1i",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-A1i",
    "esquema": "ES-4200-A1i",
    "plano": "PL-4200-A1i"
  }' && echo -e "${GREEN}✓ Producto 4200-A1i creado${NC}" || echo "✗ Error creando 4200-A1i"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-A1d",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-A1d",
    "esquema": "ES-4200-A1d",
    "plano": "PL-4200-A1d"
  }' && echo -e "${GREEN}✓ Producto 4200-A1d creado${NC}" || echo "✗ Error creando 4200-A1d"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-A2i",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-A2i",
    "esquema": "ES-4200-A2i",
    "plano": "PL-4200-A2i"
  }' && echo -e "${GREEN}✓ Producto 4200-A2i creado${NC}" || echo "✗ Error creando 4200-A2i"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-A2d",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-A2d",
    "esquema": "ES-4200-A2d",
    "plano": "PL-4200-A2d"
  }' && echo -e "${GREEN}✓ Producto 4200-A2d creado${NC}" || echo "✗ Error creando 4200-A2d"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-Bi",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-Bi",
    "esquema": "ES-4200-Bi",
    "plano": "PL-4200-Bi"
  }' && echo -e "${GREEN}✓ Producto 4200-Bi creado${NC}" || echo "✗ Error creando 4200-Bi"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-Bd",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-Bd",
    "esquema": "ES-4200-Bd",
    "plano": "PL-4200-Bd"
  }' && echo -e "${GREEN}✓ Producto 4200-Bd creado${NC}" || echo "✗ Error creando 4200-Bd"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-C1i",
    "varVi": "VANO1,VANO2,ALT1,PAF1",
    "codIvi": "1008,1008,1003,1010",
    "espVidrio": 8,
    "imagen": "IM-4200-C1i",
    "esquema": "ES-4200-C1i",
    "plano": "PL-4200-C1i"
  }' && echo -e "${GREEN}✓ Producto 4200-C1i creado${NC}" || echo "✗ Error creando 4200-C1i"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-C1d",
    "varVi": "VANO1,VANO2,ALT1,PAF1",
    "codIvi": "1008,1008,1003,1010",
    "espVidrio": 8,
    "imagen": "IM-4200-C1d",
    "esquema": "ES-4200-C1d",
    "plano": "PL-4200-C1d"
  }' && echo -e "${GREEN}✓ Producto 4200-C1d creado${NC}" || echo "✗ Error creando 4200-C1d"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-C2i",
    "varVi": "VANO1,VANO2,ALT1,PAF1",
    "codIvi": "1008,1008,1003,1010",
    "espVidrio": 8,
    "imagen": "IM-4200-C2i",
    "esquema": "ES-4200-C2i",
    "plano": "PL-4200-C2i"
  }' && echo -e "${GREEN}✓ Producto 4200-C2i creado${NC}" || echo "✗ Error creando 4200-C2i"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-C2d",
    "varVi": "VANO1,VANO2,ALT1,PAF1",
    "codIvi": "1008,1008,1003,1010",
    "espVidrio": 8,
    "imagen": "IM-4200-C2d",
    "esquema": "ES-4200-C2d",
    "plano": "PL-4200-C2d"
  }' && echo -e "${GREEN}✓ Producto 4200-C2d creado${NC}" || echo "✗ Error creando 4200-C2d"

curl -X POST "${API_URL}/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "linea": "Linea 4000",
    "serie": "Box Angular",
    "modelo": "4200-D",
    "varVi": "VANO1,VANO2,ALT1",
    "codIvi": "1008,1008,1003",
    "espVidrio": 8,
    "imagen": "IM-4200-D",
    "esquema": "ES-4200-D",
    "plano": "PL-4200-D"
  }' && echo -e "${GREEN}✓ Producto 4200-D creado${NC}" || echo "✗ Error creando 4200-D"

echo ""
echo "======================================"
echo -e "${GREEN}Carga de datos completada!${NC}"
echo "======================================"
echo ""
echo "Resumen:"
echo "- 5 Variables creadas"
echo "- 9 Códigos de Instrucción creados"
echo "- 24 Productos creados"
echo ""
