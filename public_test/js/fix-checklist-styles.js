/**
 * Fix Checklist Styles & Interaction
 * Forces removal of default list bullets (dots) and ensures checkboxes are clickable.
 */
(function () {
    function fixChecklists() {
        // Select all checkboxes in content areas
        const checkboxes = document.querySelectorAll('article input[type="checkbox"], .content-container input[type="checkbox"], li input[type="checkbox"]');

        checkboxes.forEach(cb => {
            // 1. Ensure interactive
            if (cb.hasAttribute('disabled')) {
                cb.removeAttribute('disabled');
            }
            cb.style.pointerEvents = 'auto';
            cb.style.cursor = 'pointer';

            // 2. Remove parent list bullets (dots)
            const parentLi = cb.closest('li');
            if (parentLi) {
                parentLi.style.listStyle = 'none';
                parentLi.style.listStyleType = 'none';

                // Also fix parent UL/OL to ensure no padding weirdness
                const parentList = parentLi.closest('ul, ol');
                if (parentList) {
                    parentList.style.listStyle = 'none';
                    parentList.style.paddingLeft = '0'; // Optional: remove indent if desired
                }
            }
        });
    }

    // Run immediately and on load
    fixChecklists();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixChecklists);
    }
    // Run periodically to catch dynamic content (lazy loading)
    setTimeout(fixChecklists, 500);
    setTimeout(fixChecklists, 2000);
})();
