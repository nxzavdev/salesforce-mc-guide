---
title: 'Verificación y procesamiento de Data Extensions en Automation Studio'
description: 'Procedimiento para comprobar publicación e integridad de Data Extensions provenientes de Data Cloud antes de procesarlas en Automation Studio.'
pubDate: 2025-08-19
tags: ['sfmc', 'data-cloud', 'automation-studio', 'data-extensions', 'guia']
---

# **Guía de Verificación y Procesamiento de Data Extensions en Automation Studio**

## **Sección 1 – Comprobación de data recibida desde Data Cloud**

**Objetivo:**
Asegurar que la Data Extension generada por la activación en Data Cloud ha sido publicada correctamente y que la información contenida es completa y válida antes de continuar con su procesamiento.

---

### **Paso 1 – Verificar publicación de la Data Extension en Contact Builder**

1. Inicia sesión en **Salesforce Marketing Cloud**.
2. Dirígete a **Contact Builder**.
3. Navega a la carpeta:
   **Data Extensions > Salesforce CDP**.
4. Localiza la Data Extension cuyo **nombre fue asignado en Data Cloud** (nombre proporcionado por **Ze Sergio**).
5. Confirma que:

   - La Data Extension está visible en la carpeta.
   - La fecha de última modificación corresponde con la activación esperada.
   - El estado indica que está publicada correctamente.

---

### **Paso 2 – Validar integridad de la información**

1. Abre la Data Extension y **descarga los registros** en formato CSV.
2. Revisa la columna **"Account"**:
   - No debe contener celdas vacías.
   - Dentro del JSON con los atributos del contacto no debe haber registros con valores nulos o _nullish_ (por ejemplo `"null"`).
3. Revisa el atributo principal (el definido en Data Cloud como clave o identificador, en este caso SubscriberKey):
   - Verifica que no haya valores nulos, vacíos o inconsistentes.
4. Si se detectan inconsistencias:
   - Documentar el error (número de registros afectados y tipo de inconsistencia).
   - Escalar el hallazgo al responsable de la activación en Data Cloud antes de continuar el flujo de Automation Studio.

## **Sección 2 – Creación de Data Extensions de destino para consultas de automatización**

**Objetivo:**
Configurar las Data Extensions (DE) donde se almacenarán los resultados intermedios y finales de las consultas en Automation Studio, asegurando orden, consistencia y trazabilidad en el flujo de datos.

---

### **Paso 1 – Definir estructura de carpetas y ubicación**

1. En **Contact Builder**, dirígete a la ruta correspondiente al proyecto/campaña, por ejemplo:
   **Data Extensions > Awareness > KingRanch**
2. Si la carpeta para la campaña no existe, créala siguiendo la nomenclatura establecida.

---

### **Paso 2 – Crear las Data Extensions de destino**

Para cada automatización se deben preparar **tres Data Extensions** principales, cada una con su propósito y nombre estandarizado.

En caso de que exista **más de una DE de origen**, se crea la DE de unificación de DEs:

0. **DE de Unificación de DEs**

   - Función: contener las DEs de origen unificadas.
   - Nombre sugerido:

     ```
     [NombreCampaña]_[CampaignCode]_Unify
     ```

1. **DE de Parse**

   - Función: almacenar los datos transformados en el primer paso de la consulta.
   - Nombre sugerido:

     ```
     [NombreCampaña]_[CampaignCode]_Parse
     ```

     **Ejemplo:**
     `KingRanch_CRMFORD202507G_Parse`

2. **DE de Dedup**

   - Función: recibir los datos filtrados para eliminar registros duplicados.
   - Nombre sugerido:

     ```
     [NombreCampaña]_[CampaignCode]_Dedup
     ```

3. **DE de Audiencia Final**

   - Función: contener la audiencia final que será utilizada para la segmentación o envío.
   - Nombre sugerido:

     ```
     [NombreCampaña]_[CampaignCode]_Final
     ```

---

### **Paso 3 – Método recomendado: Duplicar Data Extensions existentes**

1. Localiza en **Contact Builder** una DE de la **misma tipología de campaña** (por ejemplo, **AOR**, **Awareness**, **Events**) que tenga la misma estructura de campos y tipos de datos.
2. Utiliza la opción **“Copy Data Extension”** (botón "Duplicate"):

   - Cambia únicamente el nombre según la nomenclatura establecida.
   - Guarda en la carpeta correspondiente a la campaña actual.

3. Ventajas de este método:

   - Mantiene la consistencia en atributos y tipos de datos.
   - Ahorra tiempo de configuración.
   - Reduce errores por definición manual.

---

### **Paso 4 – Alternativa: Crear la DE desde cero**

En caso de que no exista una DE base adecuada:

1. Crear una **Standard Data Extension**:

   - **Parse** y **Dedup**: No Sendable.
   - **Final**: Sendable (con campo de relación: SubscriberKey, además configurar el campo EmailAddress como tipo de dato "EmailAddress").

2. Definir todos los atributos y tipos de datos según las reglas de negocio.
3. Configurar longitud y formato adecuado para evitar truncamientos.
4. Establecer la clave primaria en los campos correspondientes (SubscriberKey).

---

### **Paso 5 – Guardar y validar**

1. Confirmar que las DE están ubicadas en la carpeta correcta.
2. Validar que los nombres y **CampaignCode** coinciden con el documento o activación en Data Cloud.
3. Informar a los responsables de las consultas en Automation Studio que las DE están listas para su uso.

## **Sección 3 – Configuración de Automatización y Actividades en Automation Studio**

**Objetivo:**
Crear y configurar una automatización en Automation Studio para ejecutar las consultas SQL que poblarán las Data Extensions creadas en la sección anterior.

---

### **Paso 1 – Crear nueva automatización**

1. En **Automation Studio**, abre la pestaña **Overview**.
2. Ubica la carpeta correspondiente a la campaña o categoría (ej. Awareness, AOR, Events).
3. Crea una nueva automatización con la opción **New Automation**.
4. Asigna un **nombre identificador único**, siguiendo la nomenclatura establecida para la campaña.
5. Guarda la automatización en la carpeta correcta.

---

### **Paso 2 – Preparar carpeta para Queries en la pestaña Activities**

1. Dentro de la pestaña **Activities**, nos ubicamos en la barra lateral izquierda, y buscamos SQL Query. 
2. Crea una carpeta específica para los queries de la campaña.
3. Asigna un nombre claro que relacione la carpeta con la automatización y la campaña (ej. *KingRanch*).

---

### **Paso 3 – Crear actividad de Query**

1. Selecciona un **Query** de una campaña anterior de la misma categoría (ej. Awareness, AOR, Events).
2. Abre el query y copia su contenido SQL.
3. Crea una **nueva actividad de tipo SQL Query** dentro de la carpeta creada en el paso anterior.
4. Pega el contenido del query copiado.
5. Cambia la **Data Extension de origen** según corresponda a la campaña actual.

---

### **Paso 4 – Validar y seleccionar DE de destino**

1. Haz clic en **Validate Syntax** para asegurarte de que la consulta es válida.
2. En la pantalla siguiente, selecciona la **Data Extension de destino** creada en la **Sección 2**.
3. Establece **Overwrite** como método de actualización para reemplazar los datos en cada ejecución.
4. Guarda y continúa.

---

### **Paso 5 – Revisar coherencia del flujo**

1. Verifica que la **actividad de Query** y la **DE de destino** correspondan al mismo paso del proceso (Parse, Dedup o Final Audience).
2. Guarda la actividad.

---

### **Paso 6 – Repetir para cada paso**

1. Repite el proceso anterior para:

   * **Parseo:** query inicial que transforma y prepara la data.
     
   * **Deduplicación:** query que elimina registros repetidos.
     
   * **Audiencia Final:** query que genera la lista final de envío.

---

### **Ejemplo de automatización:**

**Código de ejemplo de proceso de Unify:**

**Nota:** Este proceso debe ejecutarse de forma aislada, seleccionando **Append** como método de actualización, hasta tener todas las DEs unificadas.

```sql
SELECT 
    SubscriberKey,
    EmailAddress,
    Account
FROM [DataExtensionSource]
WHERE SubscriberKey IS NOT NULL
```

**Código de ejemplo de proceso de Parse:**

```sql
SELECT 
SubscriberKey,
EmailAddress,
   JSON_VALUE(Account, '$[0].First_Name') AS FirstName,
   JSON_VALUE(Account, '$[0].SCAID') AS ConsumerId,
   JSON_VALUE(Account, '$[0].AccountTypeId') AS AccountTypeId,
   JSON_VALUE(Account, '$[0].Consumer_Type_Code_Desc') AS ConsumerTypeCodeDesc,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Acquisition_Date') AS AcquisitionDate,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Acquired_Date') AS AcquiredDate,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].VIN_c') AS Vin,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Selling_Dealer_Key') AS SellingDealerKey,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].SellingDealer_c') AS SellingDealer,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].VehicleOwnershipCycleNum_c') AS VehicleOwnershipCycleNum,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Vehicle[0].VehicleModel_c') AS VehicleModel,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Vehicle[0].VehicleModelYear_c') AS VehicleModelYear,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Vehicle[0].Vehicle_Trim_Package_Name') AS VehicleTrimPackageName,
   JSON_VALUE(Account, '$[0].Vehicle_Relationship[0].Vehicle[0].VehicleMake_c') AS VehicleMake
FROM [DataExtensionSource] 
WHERE SubscriberKey IS NOT NULL
```

**Código de ejemplo de proceso de Dedup:**

```sql
SELECT 
PD.SubscriberKey, 
PD.EmailAddress,
PD.FirstName,
PD.ConsumerId,
PD.AccountTypeId,
PD.ConsumerTypeCodeDesc,
PD.AcquisitionDate,
PD.AcquiredDate,
PD.VehicleModel,
PD.VehicleTrimPackageName,
PD.VehicleMake,
PD.Vin,
PD.SellingDealerKey,
PD.SellingDealer,
PD.VehicleOwnershipCycleNum,
PD.VehicleModelYear
FROM 
(
    SELECT 
    SubscriberKey, 
    EmailAddress,
    FirstName,
    ConsumerId,
    AccountTypeId,
    ConsumerTypeCodeDesc,
    AcquisitionDate,
    AcquiredDate,
    VehicleModel,
    VehicleTrimPackageName,
    VehicleMake,
    Vin,
    SellingDealerKey,
    SellingDealer,
    VehicleOwnershipCycleNum,
    VehicleModelYear,
    ROW_NUMBER () OVER (PARTITION BY EmailAddress ORDER BY AcquisitionDate DESC) AS rn
    FROM [DataExtensionSource] ) PD 
    WHERE PD.rn = 1
    AND PD.VehicleMake IS NOT NULL
```

**Código de ejemplo de proceso de Final Audience:**

```sql
SELECT
    F.SubscriberKey,
    F.EmailAddress,
    F.FirstName,
    F.ConsumerId,
    F.VehicleModel,
    F.Vin,
    F.SellingDealerKey,
    F.ConsumerTypeCodeDesc,
    F.AcquisitionDate
FROM [AOR_May_25_Dedup] F
WHERE F.SubscriberKey IS NOT NULL
```


### **Paso 7 – Asignar actividades en la automatización en Overview**

1. Vuelve a la pestaña **Overview** y abre la automatización creada en el **Paso 1**.
2. En el **Step 1**, **Step 2** y **Step 3** añade las **tres actividades de SQL Query** creadas previamente (Parse, Dedup y Final Audience, en ese orden).
3. Guarda los cambios.

---

### **Paso 8 – Ejecución y monitoreo**

1. Haz clic en **Run Once**.
2. Selecciona todas las actividades y confirma la ejecución.
3. El proceso suele tardar entre **3 y 10 minutos**.
4. Monitorea el avance en la pestaña **Activity**:

   * Los iconos se mostrarán en color **verde** al finalizar correctamente.

---

### **Paso 9 – Verificación final**

1. Una vez que todas las actividades estén en verde, regresa a **Contact Builder**.
2. Abre cada Data Extension de destino y comprueba que los registros se han poblado correctamente.
3. Si alguna DE está vacía o con menos registros de lo esperado:

   * Revisar el query correspondiente.
   * Confirmar que la DE de origen tenía datos válidos.
   * Ejecutar nuevamente si es necesario.
