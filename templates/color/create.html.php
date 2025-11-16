<?php

/** @var \App\Model\Color $color */
/** @var \App\Service\Router $router */

$title = 'Create Color';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Color</h1>
    <?php require __DIR__ . DIRECTORY_SEPARATOR . '_error-box.html.php'; ?>
    <form action="<?= $router->generatePath('color-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="color-create">
    </form>

    <a href="<?= $router->generatePath('color-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
