<?php

/** @var \App\Model\Color $color */
/** @var \App\Service\Router $router */

$title = htmlspecialchars("Edit Color {$color->getName()} ({$color->getId()})");
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <?php require __DIR__ . DIRECTORY_SEPARATOR . '_error-box.html.php'; ?>
    <form action="<?= $router->generatePath('color-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="color-edit">
        <input type="hidden" name="id" value="<?= $color->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('color-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('color-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="color-delete">
                <input type="hidden" name="id" value="<?= $color->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
