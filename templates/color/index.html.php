<?php

/** @var \App\Model\Color[] $colors */
/** @var \App\Service\Router $router */

$title = 'List of Colors';
$bodyClass = 'index';

ob_start(); ?>
    <h1>List of colors</h1>

    <a href="<?= $router->generatePath('color-create') ?>">Create new</a>
    <hr>

    <ul class="index-list">
        <?php foreach ($colors as $color): ?>
            <li>
                <div class="color-box">
                    <div>
                        <h3><?= htmlspecialchars($color->getName()); ?></h3>
                        <ul class="action-list">
                            <li>
                                <a href="<?= $router->generatePath('color-show', ['id' => $color->getId()]) ?>">Details</a>
                            </li>
                            <li><a href="<?= $router->generatePath('color-edit', ['id' => $color->getId()]) ?>">Edit</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div class="color-sample" style="background-color: <?= $color->getRgb()->asHex() ?>;">
                        </div>
                    </div>
                </div>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
