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
    
    function story() {
    const book = 'The Real Moby Dick'
    const text = `
<h1 style="font-size: 2em; color: #1a73e8;">Moby-Dick; Or, The Whale</h1>
<p style="font-style: italic;">By Herman Melville</p>
<h2 style="font-size: 1.5em; color: #444;">Chapter 1: Loomings</h2>
<p style="text-align: justify;">
Call me <span style="font-weight: bold;">Ishmael</span>. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can.</p>
 <p style="text-align: justify;">
This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.</p>
<p style="text-align: justify;">Excerpt from <i><strong>Moby-Dick</strong></i>, published in 1851.</p>
<p style="text-align: center; margin-top: 10px; font-size: 0.9em; color: #666;">Note: <em>This website is still being emproved</em></p>`;
   return (editor.value = text, content.innerHTML = editor.value, title.value = book);
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
         return story();
        }
    }

    // restore contents on page load
    loadContent();
});
