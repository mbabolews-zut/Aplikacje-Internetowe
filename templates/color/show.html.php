<?php

/** @var \App\Model\Color $color */
/** @var \App\Service\Router $router */

$title = htmlspecialchars("{$color->getName()} ({$color->getId()})");
$bodyClass = 'show';
$hex = $color->getRgb()?->asHex();

ob_start(); ?>
    <h1><?= htmlspecialchars($color->getName()) ?></h1>
    <article>
        <?= htmlspecialchars($color->getDescription());?>
    </article>

    <br>
    <div class="color-picker">
        <input type="text" disabled="disabled" value="<?= ($hex ?? 'unspecified') ?>">
        <div class="color-sample" style="background-color: <?= ($hex ?? '#ffffff') ?>"></div>
    </div>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('color-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('color-edit', ['id'=> $color->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
