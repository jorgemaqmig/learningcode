-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2025 a las 20:14:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `learningcode`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `challenges`
--

CREATE TABLE `challenges` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `difficulty_level` enum('Principiante','Intermedio','Avanzado') DEFAULT 'Principiante',
  `course_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `hints` text DEFAULT NULL,
  `solution` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `challenges`
--

INSERT INTO `challenges` (`id`, `title`, `description`, `difficulty_level`, `course_id`, `section_id`, `is_premium`, `created_at`, `hints`, `solution`) VALUES
(5, 'Reto de Algoritmos', 'Implementa un algoritmo de búsqueda binaria en JavaScript.', 'Avanzado', 1, 1, 0, '2025-06-12 19:08:50', '[\"Recuerda que la búsqueda binaria solo funciona en arrays ordenados.\",\"Divide el array en mitades y compara el elemento central.\",\"Usa recursividad o un bucle while para repetir el proceso.\"]', 'function busquedaBinaria(arr, x) {\n  let i = 0, j = arr.length - 1;\n  while (i <= j) {\n    let m = Math.floor((i + j) / 2);\n    if (arr[m] === x) return m;\n    if (arr[m] < x) i = m + 1;\n    else j = m - 1;\n  }\n  return -1;\n}'),
(6, 'Suma de dos números en Java', 'Escribe un programa en Java que pida al usuario dos números y muestre su suma.', 'Principiante', NULL, NULL, 0, '2025-06-12 19:56:31', '[\"Recuerda importar Scanner\", \"Utiliza nextInt() para leer números\", \"Suma los dos valores y muestra el resultado\"]', 'import java.util.Scanner;\npublic class Suma {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    System.out.print(\"Introduce el primer número: \");\n    int a = sc.nextInt();\n    System.out.print(\"Introduce el segundo número: \");\n    int b = sc.nextInt();\n    System.out.println(\"La suma es: \" + (a + b));\n  }\n}'),
(7, 'Centrar un div con CSS', 'Crea una regla CSS para centrar un div horizontal y verticalmente en la pantalla.', 'Intermedio', NULL, NULL, 0, '2025-06-12 19:56:31', '[\"Usa flexbox en el contenedor padre\", \"justify-content y align-items te ayudarán\", \"height: 100vh para ocupar toda la pantalla\"]', 'body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n'),
(8, 'Formulario de contacto en HTML', 'Crea un formulario en HTML con campos para nombre, email y mensaje, y un botón de enviar.', 'Principiante', NULL, NULL, 0, '2025-06-12 19:56:31', '[\"Usa la etiqueta <form>\", \"Utiliza <input> para nombre y email\", \"Utiliza <textarea> para el mensaje\"]', '<form>\n  <label>Nombre: <input type=\"text\" name=\"nombre\"></label><br>\n  <label>Email: <input type=\"email\" name=\"email\"></label><br>\n  <label>Mensaje:<br><textarea name=\"mensaje\"></textarea></label><br>\n  <button type=\"submit\">Enviar</button>\n</form>'),
(9, 'Contador con JavaScript', 'Haz una página con un botón que, al pulsarlo, aumente un contador mostrado en pantalla.', 'Intermedio', NULL, NULL, 1, '2025-06-12 19:56:31', '[\"Crea un elemento <span> para mostrar el número\", \"Usa addEventListener para el botón\", \"Incrementa una variable y actualiza el texto\"]', '<button id=\"btn\">Incrementar</button> <span id=\"contador\">0</span>\n<script>\nlet contador = 0;\ndocument.getElementById(\"btn\").addEventListener(\"click\", function() {\n  contador++;\n  document.getElementById(\"contador\").textContent = contador;\n});\n</script>'),
(10, 'Mostrar fecha actual en PHP', 'Crea un script en PHP que muestre la fecha y hora actual en formato \"d/m/Y H:i\".', 'Principiante', NULL, NULL, 0, '2025-06-12 19:56:31', '[\"Usa la función date()\", \"El formato es d/m/Y H:i\"]', '<?php\necho date(\"d/m/Y H:i\");\n?>'),
(11, 'Imprimir números del 1 al 10 en C', 'Escribe un programa en C que imprima los números del 1 al 10, uno por línea.', 'Principiante', NULL, NULL, 0, '2025-06-12 19:56:31', '[\"Usa un bucle for\", \"Recuerda incluir stdio.h\"]', '#include <stdio.h>\nint main() {\n  for(int i=1; i<=10; i++) {\n    printf(\"%d\\n\", i);\n  }\n  return 0;\n}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty_level` enum('Principiante','Intermedio','Avanzado') DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_premium` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `difficulty_level`, `duration_minutes`, `created_at`, `is_premium`) VALUES
(1, 'Java', 'Curso completo de Java desde cero. Aprende los fundamentos, POO, colecciones y más.', 'Intermedio', 40, '2025-05-20 18:34:10', 0),
(2, 'Python', 'Curso completo de Python desde lo básico hasta proyectos prácticos.', 'Intermedio', 45, '2025-05-24 11:37:08', 0),
(3, 'JavaScript', 'Curso completo de JavaScript desde fundamentos hasta aplicaciones prácticas.', 'Intermedio', 40, '2025-05-24 11:43:26', 0),
(4, 'C++', 'Curso de programación en C++ desde fundamentos hasta desarrollo de aplicaciones.', 'Avanzado', 60, '2025-06-07 11:43:28', 1),
(6, 'PHP', 'Curso completo de desarrollo backend con PHP, desde lo básico hasta la creación de aplicaciones web dinámicas.', 'Avanzado', 50, '2025-06-07 12:20:50', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `course_sections`
--

CREATE TABLE `course_sections` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `section_order` int(11) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `is_premium` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `course_sections`
--

INSERT INTO `course_sections` (`id`, `course_id`, `title`, `description`, `section_order`, `content`, `is_premium`) VALUES
(1, 1, 'Introducción a Java', 'Historia, características y configuración del entorno.', 1, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Java es un lenguaje de programación orientado a objetos, creado por Sun Microsystems en 1995. Es ampliamente utilizado por su portabilidad (\\\"escribe una vez, corre en cualquier lugar\\\").\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"java\",\r\n    \"contenido\": \"public class HolaMundo {\\n  public static void main(String[] args) {\\n    System.out.println(\\\"Hola, mundo\\\");\\n  }\\n}\"\r\n  }\r\n]', 0),
(2, 1, 'Sintaxis básica', 'Variables, tipos de datos, operadores y estructuras de control.', 2, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Java tiene una sintaxis estricta que se parece a C. Incluye tipos primitivos, operadores, estructuras de control como if y bucles.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"java\",\r\n    \"contenido\": \"int edad = 25;\\nString nombre = \\\"Ana\\\";\\nif (edad > 18) {\\n  System.out.println(\\\"Eres mayor de edad\\\");\\n}\"\r\n  },\r\n  {\r\n    \"tipo\": \"formulario\",\r\n    \"pregunta\": \"Declara una variable de tipo `double` llamada `precio` con valor 19.99.\",\r\n    \"validacion\": {\r\n      \"tipo\": \"codigo\",\r\n      \"lenguaje\": \"java\",\r\n      \"esperado\": \"double precio = 19.99;\"\r\n    }\r\n  }\r\n]', 0),
(3, 1, 'Programación Orientada a Objetos', 'Clases, objetos, herencia, polimorfismo.', 3, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"La Programación Orientada a Objetos (POO) en Java permite modelar el mundo real con clases y objetos. También permite herencia, polimorfismo, encapsulamiento y abstracción.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"java\",\r\n    \"contenido\": \"public class Persona {\\n  String nombre;\\n\\n  public Persona(String nombre) {\\n    this.nombre = nombre;\\n  }\\n\\n  public void saludar() {\\n    System.out.println(\\\"Hola, soy \\\" + nombre);\\n  }\\n}\"\r\n  }\r\n]', 0),
(4, 1, 'Colecciones y Arrays', 'Uso de arrays, ArrayList, HashMap y otras colecciones.', 4, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Las colecciones permiten almacenar múltiples elementos. `Array`, `ArrayList`, `HashMap` y `HashSet` son comunes en Java.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"java\",\r\n    \"contenido\": \"ArrayList<String> nombres = new ArrayList<>();\\nnombres.add(\\\"Ana\\\");\\nnombres.add(\\\"Luis\\\");\\n\\nfor (String nombre : nombres) {\\n  System.out.println(nombre);\\n}\"\r\n  }\r\n]', 0),
(5, 1, 'Manejo de Excepciones', 'Try-catch, tipos de excepciones y buenas prácticas.', 5, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Las excepciones son errores que pueden ocurrir en tiempo de ejecución. Java permite manejarlas con bloques try-catch.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"java\",\r\n    \"contenido\": \"try {\\n  int resultado = 10 / 0;\\n} catch (ArithmeticException e) {\\n  System.out.println(\\\"Error: división por cero\\\");\\n}\"\r\n  }\r\n]', 0),
(6, 1, 'Entrada/Salida', 'Lectura y escritura de archivos, streams.', 6, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Java ofrece varias clases para entrada y salida, como Scanner para leer datos y FileWriter para escribir archivos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"java\",\r\n    \"contenido\": \"Scanner scanner = new Scanner(System.in);\\nSystem.out.print(\\\"Introduce tu nombre: \\\" );\\nString nombre = scanner.nextLine();\\nSystem.out.println(\\\"Hola, \\\" + nombre);\"\r\n  }\r\n]', 0),
(7, 1, 'Proyecto Final', 'Desarrollo de una aplicación Java completa.', 7, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"El proyecto final consiste en crear una pequeña aplicación Java que aplique los conceptos aprendidos: clases, colecciones, entrada/salida y manejo de errores.\"\r\n  },\r\n  {\r\n    \"tipo\": \"formulario\",\r\n    \"pregunta\": \"¿Qué funcionalidades tendría tu aplicación final en Java?\",\r\n    \"validacion\": {\r\n      \"tipo\": \"texto\",\r\n      \"min_palabras\": 20\r\n    }\r\n  }\r\n]', 0),
(8, 2, 'Introducción a Python', 'Historia, características y configuración del entorno.', 1, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Python es un lenguaje de programación interpretado, creado por Guido van Rossum. Es conocido por su sintaxis clara y legibilidad.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"python\",\r\n    \"contenido\": \"print(\\\"Hola, mundo\\\")\"\r\n  }\r\n]', 0),
(9, 2, 'Sintaxis básica', 'Variables, tipos de datos, operadores y estructuras de control.', 2, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Python usa indentación para definir bloques. Tiene variables dinámicas y tipos de datos como str, int, float y bool.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"python\",\r\n    \"contenido\": \"edad = 30\\nif edad >= 18:\\n  print(\\\"Eres mayor de edad\\\")\"\r\n  }\r\n]', 0),
(10, 2, 'Funciones y Módulos', 'Definición y uso de funciones, módulos y paquetes.', 3, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Las funciones en Python se definen con def. Los módulos permiten reutilizar código en varios archivos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"python\",\r\n    \"contenido\": \"def saludar(nombre):\\n  print(f\\\"Hola, {nombre}\\\")\\n\\nsaludar(\\\"Ana\\\")\"\r\n  }\r\n]', 0),
(11, 2, 'Estructuras de datos', 'Listas, diccionarios, tuplas y sets.', 4, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Python incluye estructuras como listas, diccionarios, tuplas y sets para almacenar datos de forma flexible.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"python\",\r\n    \"contenido\": \"frutas = [\\\"manzana\\\", \\\"banana\\\"]\\nfor fruta in frutas:\\n  print(fruta)\"\r\n  }\r\n]', 0),
(12, 2, 'Manejo de errores', 'Uso de try-except y manejo de excepciones.', 5, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Python usa try-except para manejar excepciones, permitiendo controlar errores sin detener el programa.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"python\",\r\n    \"contenido\": \"try:\\n  resultado = 10 / 0\\nexcept ZeroDivisionError:\\n  print(\\\"Error: división por cero\\\")\"\r\n  }\r\n]', 0),
(13, 2, 'Lectura y escritura de archivos', 'Uso de open(), lectura/escritura y manejo de archivos.', 6, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Puedes leer y escribir archivos usando open(), y los métodos read(), write(), etc.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"python\",\r\n    \"contenido\": \"with open(\\\"saludo.txt\\\", \\\"w\\\") as archivo:\\n  archivo.write(\\\"Hola, archivo\\\")\"\r\n  }\r\n]', 0),
(14, 2, 'Proyecto final', 'Crear una pequeña aplicación en Python.', 7, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Tu proyecto final será una pequeña aplicación en Python, por ejemplo una calculadora, agenda o juego simple.\"\r\n  },\r\n  {\r\n    \"tipo\": \"formulario\",\r\n    \"pregunta\": \"Describe qué funcionalidad tendrá tu aplicación final en Python.\",\r\n    \"validacion\": {\r\n      \"tipo\": \"texto\",\r\n      \"min_palabras\": 20\r\n    }\r\n  }\r\n]', 0),
(15, 3, 'Introducción a JavaScript', 'Historia, uso en navegadores y evolución del lenguaje.', 1, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"JavaScript es un lenguaje de programación interpretado que se ejecuta en el navegador. Es esencial para crear páginas web interactivas.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"javascript\",\r\n    \"contenido\": \"console.log(\\\"Hola, JavaScript\\\");\"\r\n  }\r\n]', 0),
(16, 3, 'Sintaxis y variables', 'Declaración de variables, tipos de datos y operadores.', 2, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"JavaScript usa var, let y const para declarar variables. Los tipos incluyen string, number, boolean, null y undefined.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"javascript\",\r\n    \"contenido\": \"let nombre = \\\"Carlos\\\";\\nconst edad = 30;\\nconsole.log(nombre, edad);\"\r\n  }\r\n]', 0),
(17, 3, 'Funciones y eventos', 'Definición de funciones, eventos del DOM y callbacks.', 3, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Las funciones permiten reutilizar código. JavaScript maneja eventos del DOM para interactuar con el usuario.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"javascript\",\r\n    \"contenido\": \"function saludar() {\\n  alert(\\\"Hola desde una función\\\");\\n}\\ndocument.getElementById(\\\"boton\\\").addEventListener(\\\"click\\\", saludar);\"\r\n  }\r\n]', 0),
(18, 3, 'Manipulación del DOM', 'Acceso y modificación de elementos HTML con JavaScript.', 4, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"El DOM representa la estructura HTML como objetos que pueden ser manipulados con JavaScript.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"javascript\",\r\n    \"contenido\": \"document.getElementById(\\\"titulo\\\").textContent = \\\"Nuevo título\\\";\"\r\n  }\r\n]', 0),
(19, 3, 'Control de flujo y estructuras', 'If, switch, bucles, arrays y objetos.', 5, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"JavaScript permite controlar el flujo con if, switch, while, for y estructuras como arrays y objetos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"javascript\",\r\n    \"contenido\": \"let frutas = [\\\"manzana\\\", \\\"pera\\\"];\\nfor (let fruta of frutas) {\\n  console.log(fruta);\\n}\"\r\n  }\r\n]', 0),
(20, 3, 'Fetch API y Promesas', 'Peticiones HTTP, promesas y async/await.', 6, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Fetch permite realizar peticiones HTTP. Las promesas manejan operaciones asincrónicas de forma clara y estructurada.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"javascript\",\r\n    \"contenido\": \"fetch(\\\"https://api.example.com/datos\\\")\\n  .then(response => response.json())\\n  .then(data => console.log(data));\"\r\n  }\r\n]', 0),
(21, 3, 'Proyecto final', 'Desarrollo de una mini aplicación web interactiva.', 7, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"En el proyecto final crearás una pequeña aplicación web interactiva con HTML, CSS y JavaScript.\"\r\n  },\r\n  {\r\n    \"tipo\": \"formulario\",\r\n    \"pregunta\": \"¿Qué funcionalidad tendrá tu aplicación JavaScript?\",\r\n    \"validacion\": {\r\n      \"tipo\": \"texto\",\r\n      \"min_palabras\": 20\r\n    }\r\n  }\r\n]', 0),
(22, 4, 'Introducción a C++', 'Historia, usos y compilación de programas.', 1, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"C++ es un lenguaje de programación compilado, basado en C, creado por Bjarne Stroustrup. Se usa para software de alto rendimiento.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"cpp\",\r\n    \"contenido\": \"#include <iostream>\\nint main() {\\n  std::cout << \\\"Hola, C++!\\\" << std::endl;\\n  return 0;\\n}\"\r\n  }\r\n]', 1),
(23, 4, 'Sintaxis básica', 'Variables, tipos de datos, operadores, estructuras de control.', 2, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"C++ utiliza sintaxis basada en C. Puedes declarar variables con tipos como int, float, char, etc.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"cpp\",\r\n    \"contenido\": \"int edad = 25;\\nif (edad >= 18) {\\n  std::cout << \\\"Eres mayor de edad\\\" << std::endl;\\n}\"\r\n  }\r\n]', 1),
(24, 4, 'Funciones y ámbito', 'Definición de funciones, parámetros, ámbito de variables.', 3, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Las funciones permiten modularizar el código. Las variables tienen ámbito local o global según dónde se declaren.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"cpp\",\r\n    \"contenido\": \"int suma(int a, int b) {\\n  return a + b;\\n}\\nint main() {\\n  std::cout << suma(3, 4);\\n  return 0;\\n}\"\r\n  }\r\n]', 1),
(25, 4, 'Programación orientada a objetos', 'Clases, objetos, encapsulamiento, herencia.', 4, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"C++ permite programación orientada a objetos: clases, herencia, encapsulamiento.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"cpp\",\r\n    \"contenido\": \"class Persona {\\npublic:\\n  std::string nombre;\\n  void saludar() {\\n    std::cout << \\\"Hola \\\" << nombre << std::endl;\\n  }\\n};\"\r\n  }\r\n]', 1),
(26, 4, 'Manejo de memoria', 'Punteros, referencias, memoria dinámica.', 5, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"C++ te permite gestionar la memoria manualmente usando punteros y new/delete.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"cpp\",\r\n    \"contenido\": \"int* ptr = new int(5);\\nstd::cout << *ptr << std::endl;\\ndelete ptr;\"\r\n  }\r\n]', 1),
(27, 4, 'E/S y archivos', 'Lectura/escritura desde consola y archivos.', 6, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Para leer y escribir archivos se usa fstream. También puedes leer del teclado con cin.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"cpp\",\r\n    \"contenido\": \"#include <fstream>\\nstd::ofstream archivo(\\\"salida.txt\\\");\\narchivo << \\\"Hola archivo\\\";\\narchivo.close();\"\r\n  }\r\n]', 1),
(28, 4, 'Proyecto final', 'Desarrollar una aplicación en C++ aplicando todo lo aprendido.', 7, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"El proyecto final consiste en desarrollar una calculadora o una app de consola usando clases y archivos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"formulario\",\r\n    \"pregunta\": \"Describe qué funcionalidad tendrá tu proyecto final en C++.\",\r\n    \"validacion\": {\r\n      \"tipo\": \"texto\",\r\n      \"min_palabras\": 20\r\n    }\r\n  }\r\n]', 1),
(36, 6, 'Introducción a PHP', 'Qué es PHP, historia, instalación y primeros pasos.', 1, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"PHP es un lenguaje de programación del lado del servidor utilizado principalmente para el desarrollo web. Fue creado en 1994 por Rasmus Lerdorf.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"php\",\r\n    \"contenido\": \"<?php\\necho \\\"¡Hola, mundo desde PHP!\\\";\\n?>\"\r\n  }\r\n]', 0),
(37, 6, 'Sintaxis básica y variables', 'Estructura del lenguaje, declaración de variables, tipos.', 2, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"PHP usa el símbolo $ para declarar variables. Los tipos se asignan automáticamente.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"php\",\r\n    \"contenido\": \"<?php\\n$nombre = \\\"Juan\\\";\\necho \\\"Hola \\\" . $nombre;\\n?>\"\r\n  }\r\n]', 0),
(38, 6, 'Condicionales y bucles', 'Estructuras de control if, switch, while, for.', 3, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"PHP admite estructuras como if, else, switch, while y for para el control de flujo.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"php\",\r\n    \"contenido\": \"<?php\\nfor ($i = 1; $i <= 5; $i++) {\\n  echo \\\"Número: $i<br>\\\";\\n}\\n?>\"\r\n  }\r\n]', 0),
(39, 6, 'Funciones y arrays', 'Definición de funciones, tipos de arrays, foreach.', 4, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Puedes definir funciones con function y usar arrays indexados o asociativos para manejar colecciones de datos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"php\",\r\n    \"contenido\": \"<?php\\nfunction saludar($nombre) {\\n  return \\\"Hola \\\" . $nombre;\\n}\\necho saludar(\\\"Ana\\\");\\n?>\"\r\n  }\r\n]', 0),
(40, 6, 'Formularios y manejo de datos', 'POST, GET, validación y sanitización de datos.', 5, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"PHP recibe datos de formularios a través de \\$_POST y \\$_GET. Es importante validar y sanitizar estos datos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"php\",\r\n    \"contenido\": \"<?php\\nif ($_SERVER[\\\"REQUEST_METHOD\\\"] == \\\"POST\\\") {\\n  $nombre = htmlspecialchars($_POST[\\\"nombre\\\"]);\\n  echo \\\"Nombre: \\\" . $nombre;\\n}\\n?>\"\r\n  }\r\n]', 0),
(41, 6, 'Conexión a bases de datos', 'Uso de PDO y MySQLi para interactuar con bases de datos.', 6, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Puedes conectar PHP a bases de datos usando PDO o MySQLi. Es recomendable usar sentencias preparadas para evitar inyecciones SQL.\"\r\n  },\r\n  {\r\n    \"tipo\": \"codigo\",\r\n    \"lenguaje\": \"php\",\r\n    \"contenido\": \"<?php\\ntry {\\n  $pdo = new PDO(\\\"mysql:host=localhost;dbname=test\\\", \\\"root\\\", \\\"\\\");\\n  echo \\\"Conectado exitosamente\\\";\\n} catch (PDOException $e) {\\n  echo \\\"Error: \\\" . $e->getMessage();\\n}\\n?>\"\r\n  }\r\n]', 0),
(42, 6, 'Proyecto final', 'Crear una aplicación web básica con PHP y base de datos.', 7, '[\r\n  {\r\n    \"tipo\": \"texto\",\r\n    \"contenido\": \"Crea una aplicación web básica, como un blog o sistema de comentarios, usando formularios, validación y una base de datos.\"\r\n  },\r\n  {\r\n    \"tipo\": \"formulario\",\r\n    \"pregunta\": \"¿Qué funcionalidades incluirás en tu proyecto final con PHP?\",\r\n    \"validacion\": {\r\n      \"tipo\": \"texto\",\r\n      \"min_palabras\": 20\r\n    }\r\n  }\r\n]', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `plan` enum('Free','Premium') DEFAULT 'Free'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `avatar`, `created_at`, `plan`) VALUES
(1, 'jorge', 'jorge@gmail.com', '$2b$10$DAq9NQrX2FS6tBiQJ5u/o.CpojlBAOIr05DP8GvscTSCQiXnAC72u', '1-1748952533863.png', '2025-05-17 13:26:58', 'Premium'),
(2, 'paula', 'paula@gmail.com', '$2b$10$d.pJlWisqrCFVZ1Ay7s9Here/Hv2MVxAX1WJ2yw4OaXROyP/Y55ty', '2-1749902837500.png', '2025-06-02 12:37:15', 'Free');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_courses`
--

CREATE TABLE `user_courses` (
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `progress_percentage` int(11) DEFAULT 0,
  `status` varchar(255) DEFAULT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `last_updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_courses`
--

INSERT INTO `user_courses` (`user_id`, `course_id`, `progress_percentage`, `status`, `started_at`, `completed_at`, `last_updated_at`) VALUES
(1, 1, 86, 'in_progress', '2025-05-26 20:53:42', NULL, '2025-06-11 12:58:52'),
(1, 2, 100, 'completed', '2025-05-26 20:52:41', '2025-06-09 15:15:06', '2025-06-09 15:15:06'),
(1, 3, 100, 'completed', '2025-06-09 16:19:36', '2025-06-09 16:21:27', '2025-06-09 16:21:27'),
(1, 4, 100, 'completed', '2025-06-09 14:51:25', '2025-06-09 16:48:02', '2025-06-09 16:48:02'),
(1, 6, 100, 'completed', '2025-06-09 15:15:06', '2025-06-09 15:19:46', '2025-06-09 15:19:46'),
(2, 1, 14, 'in_progress', '2025-06-02 12:54:59', NULL, '2025-06-02 12:54:59'),
(2, 2, 14, 'in_progress', '2025-06-09 10:24:07', NULL, '2025-06-11 19:37:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_sections`
--

CREATE TABLE `user_sections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user_sections`
--

INSERT INTO `user_sections` (`id`, `user_id`, `course_id`, `section_id`, `completed_at`) VALUES
(16, 2, 1, 1, NULL),
(75, 1, 3, 1, '2025-06-09 16:41:34'),
(110, 1, 4, 1, '2025-06-09 16:41:43'),
(113, 1, 6, 1, '2025-06-09 16:41:48'),
(120, 1, 4, 23, '2025-06-09 16:51:27'),
(126, 1, 2, 8, '2025-06-09 16:57:06'),
(127, 1, 2, 9, '2025-06-09 16:57:07'),
(128, 1, 2, 10, '2025-06-09 16:57:08'),
(129, 1, 2, 11, '2025-06-09 16:57:10'),
(130, 1, 2, 12, '2025-06-09 16:57:11'),
(131, 1, 2, 13, '2025-06-09 16:57:13'),
(138, 1, 2, 14, '2025-06-09 17:14:15'),
(139, 1, 6, 36, '2025-06-09 17:14:36'),
(140, 1, 6, 37, '2025-06-09 17:18:37'),
(141, 1, 6, 38, '2025-06-09 17:18:39'),
(142, 1, 6, 39, '2025-06-09 17:18:41'),
(143, 1, 6, 40, '2025-06-09 17:18:43'),
(144, 1, 6, 41, '2025-06-09 17:18:45'),
(147, 1, 6, 42, '2025-06-09 17:19:46'),
(148, 1, 4, 24, '2025-06-09 17:22:48'),
(149, 1, 4, 25, '2025-06-09 17:22:50'),
(150, 1, 4, 26, '2025-06-09 17:22:52'),
(151, 1, 4, 27, '2025-06-09 17:22:54'),
(152, 1, 3, 15, '2025-06-09 18:19:36'),
(153, 1, 3, 20, '2025-06-09 18:19:38'),
(154, 1, 3, 21, '2025-06-09 18:19:41'),
(155, 1, 3, 19, '2025-06-09 18:19:42'),
(156, 1, 3, 18, '2025-06-09 18:19:43'),
(157, 1, 3, 17, '2025-06-09 18:19:45'),
(158, 1, 3, 16, '2025-06-09 18:19:47'),
(160, 1, 1, 2, '2025-06-09 18:26:50'),
(161, 1, 1, 3, '2025-06-09 18:26:51'),
(166, 1, 1, 1, '2025-06-09 18:36:58'),
(169, 1, 4, 28, '2025-06-09 18:47:51'),
(170, 1, 4, 22, '2025-06-09 18:48:02'),
(171, 1, 1, 4, '2025-06-09 18:48:23'),
(172, 1, 1, 5, '2025-06-09 18:48:25'),
(175, 1, 1, 6, NULL),
(178, 2, 2, 8, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `challenges`
--
ALTER TABLE `challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indices de la tabla `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `course_sections`
--
ALTER TABLE `course_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_courses`
--
ALTER TABLE `user_courses`
  ADD PRIMARY KEY (`user_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indices de la tabla `user_sections`
--
ALTER TABLE `user_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`course_id`,`section_id`),
  ADD KEY `fk_course` (`course_id`),
  ADD KEY `fk_section` (`section_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `challenges`
--
ALTER TABLE `challenges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `course_sections`
--
ALTER TABLE `course_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `user_sections`
--
ALTER TABLE `user_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `challenges`
--
ALTER TABLE `challenges`
  ADD CONSTRAINT `challenges_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `challenges_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `course_sections`
--
ALTER TABLE `course_sections`
  ADD CONSTRAINT `course_sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_courses`
--
ALTER TABLE `user_courses`
  ADD CONSTRAINT `user_courses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Filtros para la tabla `user_sections`
--
ALTER TABLE `user_sections`
  ADD CONSTRAINT `fk_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_section` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
