document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.code-copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const codeContainer = btn.closest('.code-block-container');
            const codeBlock = codeContainer.querySelector('code');

            if (!codeBlock) return;

            const textToCopy = codeBlock.innerText; // Get text content

            try {
                await navigator.clipboard.writeText(textToCopy);

                // Visual Feedback
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.classList.add('copied');

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove('copied');
                }, 2000);

            } catch (err) {
                console.error('Failed to copy text: ', err);
                btn.innerText = 'Error';
            }
        });
    });
});
