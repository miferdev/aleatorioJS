document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sugerencia-form');
    const totalSteps = 3;
    let currentStep = 1;
    
    function showStep(step) {
        document.querySelectorAll('.form-group-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        const stepEl = document.getElementById(`step-${step}`);
        if (stepEl) {
            stepEl.classList.add('active');
            currentStep = step;
        }
    }

    function validateStep(step) {
        let isValid = true;
        const stepElement = document.getElementById(`step-${step}`);
        const requiredFields = stepElement.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const formField = field.closest('.form-field') || field.parentElement;
            formField.classList.remove('error');

            let fieldIsValid = false;

            if (field.type === 'radio') {
                const radioGroupName = field.name;
                const radios = stepElement.querySelectorAll(`input[name="${radioGroupName}"]`);
                fieldIsValid = Array.from(radios).some(radio => radio.checked);
            } else if (field.tagName === 'SELECT') {
                fieldIsValid = field.value !== "";
            } else {
                fieldIsValid = field.value.trim() !== "";
            }

            if (!fieldIsValid) {
                isValid = false;
                formField.classList.add('error');
            }
        });

        if (!isValid) {
            alert("Todos los campos son requeridos");
        }
        return isValid;
    }

    function generateXMLAndDownload(data) { 
        function appendElement(parent, name, value) {
            const el = xmlDoc.createElement(name);
            el.textContent = value || ''; 
            parent.appendChild(el);
        }

        const xmlDoc = document.implementation.createDocument(null, "Formulario", null);
        const root = xmlDoc.documentElement;

        appendElement(root, "nombre", data.nombre);
        appendElement(root, "email", data.email);
        appendElement(root, "edad", data.edad);
        appendElement(root, "sexo", data.sexo);
        appendElement(root, "encontro", data.encontro);
        appendElement(root, "tematica", data.tematica);
        appendElement(root, "descripcion", data.descripcion);
        
        const serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(xmlDoc);
        xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n` + xmlString;

        xmlString = formatXml(xmlString);

        const blob = new Blob([xmlString], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Formulario ${data.nombre}.xml`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

function formatXml(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');
    const lines = xml.split('\r\n');

    lines.forEach((node, index) => {
        let indent = 0;

        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        let extraPad = pad > 0 ? 1 : 0;

        formatted += PADDING.repeat(pad + extraPad) + node + '\r\n';
        pad += indent;
    });

    return formatted.trim();
}
    
    function setupFormNavigation() {
        form.addEventListener('click', (event) => {
            if (event.target.classList.contains('next-step')) {
                if (validateStep(currentStep)) { 
                    if (currentStep < totalSteps) {
                        showStep(currentStep + 1);
                    }
                }
            } else if (event.target.classList.contains('prev-step')) {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            }
        });

        showStep(1);
    }
    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        if (validateStep(currentStep)) { 
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            generateXMLAndDownload(data);
        }
    });

    setupFormNavigation();
});