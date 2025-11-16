<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Color;
use App\Service\Router;
use App\Service\Templating;

class ColorController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $colors = Color::findAll();
        $html = $templating->render('color/index.html.php', [
            'colors' => $colors,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestColor, Templating $templating, Router $router): ?string
    {
        $errors = [];
        if ($requestColor) {
            $color = Color::fromArray($requestColor);
            $errors = $color->validate();
            if (empty($errors)) {
                // No validation errors
                $color->save();
                $path = $router->generatePath('color-index');
                $router->redirect($path);
                return null;
            }
        } elseif (empty($errors)) {
            $color = new Color();
        }

        $html = $templating->render('color/create.html.php', [
            'color' => $color,
            'errors' => empty($errors) ? null : $errors,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $colorId, ?array $requestColor, Templating $templating, Router $router): ?string
    {
        $color = Color::find($colorId);
        if (!$color) {
            throw new NotFoundException("Missing color with id $colorId");
        }
        $errors = [];
        if ($requestColor) {
            $color->fill($requestColor);
            $errors = $color->validate();
            if (empty($errors)) {
                // No validation errors
                $color->save();
                $path = $router->generatePath('color-index');
                $router->redirect($path);
                return null;
            }
        }

        $html = $templating->render('color/edit.html.php', [
            'color' => $color,
            'errors' => empty($errors) ? null : $errors,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $colorId, Templating $templating, Router $router): ?string
    {
        $color = Color::find($colorId);
        if (!$color) {
            throw new NotFoundException("Missing color with id $colorId");
        }
        $html = $templating->render('color/show.html.php', [
            'color' => $color,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $colorId, Router $router): ?string
    {
        $color = Color::find($colorId);
        if (!$color) {
            throw new NotFoundException("Missing color with id $colorId");
        }
        $color->delete();
        $path = $router->generatePath('color-index');
        $router->redirect($path);
        return null;
    }
}