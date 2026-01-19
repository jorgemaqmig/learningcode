const axios = require('axios');

class ExecutionController {
    static async executeCode(req, res) {
        try {
            const { language, source } = req.body;

            console.log('Solicitud de ejecución recibida:', { language });

            if (!language || !source) {
                return res.status(400).json({
                    success: false,
                    error: 'Se requiere lenguaje y código fuente'
                });
            }

            // Normalizar el lenguaje para Piston (la API usa nombres específicos)
            // Mapeamos nuestros nombres a los de Piston API v2
            const languageMap = {
                'javascript': 'javascript',
                'js': 'javascript',
                'node': 'javascript',
                'python': 'python',
                'py': 'python',
                'java': 'java',
                'c': 'c',
                'cpp': 'c++',
                'c++': 'c++',
                'go': 'go',
                'typescript': 'typescript',
                'ts': 'typescript'
            };

            const pistonLang = languageMap[language.toLowerCase()];

            if (!pistonLang) {
                return res.status(400).json({
                    success: false,
                    error: `Lenguaje no soportado: ${language}`
                });
            }

            console.log('Enviando código a Piston API:', pistonLang);

            // Si hay código de prueba, lo adjuntamos al código del usuario
            let finalSource = source;
            const { testCode } = req.body;

            if (testCode) {
                // Añadimos un separador y el código de prueba
                // En Python, aseguramos saltos de línea.
                finalSource = `${source}\n\n${testCode}`;
                console.log('Adjuntando test cases al código original.');
            }

            // Llamada a Piston API v2
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: pistonLang,
                version: "*",
                files: [
                    {
                        content: finalSource
                    }
                ]
            });

            const result = response.data;
            console.log('Respuesta recibida de Piston API');

            // Lógica de verificación de tests
            let testsPassed = null; // null significa que no hubo tests
            let cleanOutput = result.run.output;

            if (testCode) {
                // Buscamos la marca de éxito (usamos regex para ser más flexibles con espacios/saltos de línea)
                const successRegex = /__TEST_SUCCESS__/;
                if (successRegex.test(result.run.output)) {
                    testsPassed = true;
                    // Limpiamos la marca de éxito
                    cleanOutput = result.run.output.replace(/__TEST_SUCCESS__/g, '').trim();
                } else {
                    testsPassed = false;
                }
            }

            // Procesar la respuesta para el frontend
            res.json({
                success: true,
                run: {
                    stdout: result.run.stdout,
                    stderr: result.run.stderr,
                    code: result.run.code,
                    signal: result.run.signal,
                    output: cleanOutput
                },
                testsPassed: testsPassed
            });

        } catch (error) {
            console.error('Error executing code:', error.message);
            res.status(500).json({
                success: false,
                error: 'Error al ejecutar el código: ' + (error.response?.data?.message || error.message)
            });
        }
    }
}

module.exports = ExecutionController;
