const PageRoutes = {
    dashboard: 'index.html',
    feedback: 'feedback.html',
    action: 'action.html',
    teaching: 'teaching.html',
    manage: 'manage.html',
    project: 'project.html'
};

function navigateTo(page) {
    const target = PageRoutes[page];
    if (target) {
        window.location.href = target;
    }
}

function initNavigation() {
    const menuItems = document.querySelectorAll('.menu li[data-page]');
    menuItems.forEach(item => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });

        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigateTo(item.dataset.page);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initNavigation);
