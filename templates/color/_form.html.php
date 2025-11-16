<?php
/** @var $color ?\App\Model\Color */

$hex = $color->getRgb()?->asHex() ?? '#ffffff';
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" minlength="3" name="color[name]" value="<?= htmlspecialchars($color->getName() ?? '') ?>" required>
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="color[description]"><?= htmlspecialchars($color->getDescription() ?? '') ?></textarea>
</div>

<div class="form-group">
    <label for="rgb">RGB (Hex format, e.g. #FFAA33)</label>
    <div class="color-picker" style="display: inline-block;">
        <input type="text" id="rgb" minlength="4" maxlength="7" name="color[rgb]" pattern="^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$"
               placeholder="e.g. #ffaa33"
               onchange="document.getElementById('color-preview').style.backgroundColor = this.value;"
               value="<?= $hex ?>" required>
        <div id="color-preview" class="color-sample" style="background-color: <?= $hex ?>;"></div>
    </div>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
