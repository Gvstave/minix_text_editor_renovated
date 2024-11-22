document.addEventListener('DOMContentLoaded', function () {

    // Referenced elements
    const title = document.getElementById('title');
    const editor = document.getElementById('editor');
    const content = document.getElementById('content');
    const mic = document.getElementById('mic');
    const editNote = document.getElementById('edit_note');
    const download = document.getElementById('download');
    const trash = document.getElementById('trash');

    // Local storage keys
    const STORAGE_KEY_TITLE = "titleStoredContent";
    const STORAGE_KEY = "editorStoredContent";

    // Initial setup
    title.disabled = true;
    trash.style.display = 'none';

    // Toggle between edit and read-only mode
    editNote.addEventListener('click', function () {
        if (content.style.display === 'none') {
            toReadOnly();
        } else {
            toEditMode();
        }

        // Show or hide the trash button
        trash.style.display = trash.style.display === 'none' ? 'block' : 'none';
    });

    // Save title to localStorage on input
    title.addEventListener('input', function () {
        localStorage.setItem(STORAGE_KEY_TITLE, title.value);
    });

    // Save editor content to localStorage on input
    editor.addEventListener('input', function () {
        localStorage.setItem(STORAGE_KEY, editor.value);
    });

    // Clear localStorage and reset the fields
    trash.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY_TITLE);
        localStorage.removeItem(STORAGE_KEY);
        title.value = "";
        editor.value = "";
    });

    // Generate PDF from the content
    download.addEventListener('click', function () {
        generatePDF();
    });

    // Text-to-speech functionality
    mic.addEventListener('click', function () {
        if (content.style.display === 'none') {
            alert("Speech is only available in read-only mode.");
            return;
        }

        if ('speechSynthesis' in window) {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                return;
            }

            const message = new SpeechSynthesisUtterance(content.textContent.trim());
            message.lang = 'en-US';
            message.rate = 1;
            message.pitch = 1;
            message.onerror = () => {
                alert("An error occurred during speech processing!");
            };
            speechSynthesis.speak(message);
        } else {
            alert("Speech is not supported in this browser.");
        }
    });

    // Switch to read-only mode:
    function toReadOnly() {
        document.querySelectorAll('.disabled').forEach(function (inputElements) {
            inputElements.style.display = 'initial';
        });
        title.disabled = true;
        content.style.display = 'block';
        content.innerHTML = editor.value;
        editor.style.display = 'none';
    }

    function toEditMode() {
        document.querySelectorAll('.disabled').forEach(function (inputElements) {
            inputElements.style.display = 'none';
        });
        title.disabled = false;
        content.style.display = 'none';
        editor.style.display = 'block';
        title.focus();
    }

    function generatePDF() {
        content.style.display = 'block';
        html2canvas(content, { scale: 2 }).then(function (canvas) {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${title.value}.pdf`);
        });
        content.style.display = 'block';
    }

    // Load content from localStorage
    function loadContent() {
        const titleContent = localStorage.getItem(STORAGE_KEY_TITLE);
        const editorContent = localStorage.getItem(STORAGE_KEY);

        if (titleContent || editorContent) {
            title.value = titleContent || "";
            editor.value = editorContent || "";
            content.innerHTML = editorContent || "";
        } else {
            alert("No content found in Local Storage!");
        }
    }

    // restore contents on page load
    loadContent();
});