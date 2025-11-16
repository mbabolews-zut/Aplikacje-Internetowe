<?php

namespace App\DataTypes;

class ColorRGB
{
    public $r = 0;
    public $g = 0;
    public $b = 0;

    public function __construct(int $r = 0, int $g = 0, int $b = 0)
    {
        $this->r = max(0, min(255, $r));
        $this->g = max(0, min(255, $g));
        $this->b = max(0, min(255, $b));
    }

    static public function fromArray(array $array): ColorRGB
    {
        return new self(
            $array['r'] ?? 0,
            $array['g'] ?? 0,
            $array['b'] ?? 0
        );
    }

    static public function fromHex(string $hex): ?ColorRGB
    {
        $hex = ltrim($hex, '#');
        if (!preg_match('/^([0-9a-f]{3}|[0-9a-f]{6})$/i', $hex)) {
            return null;
        }
        if (strlen($hex) === 6) {
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
            return new self($r, $g, $b);
        }
        elseif (strlen($hex) === 3) {
            $r = hexdec(str_repeat(substr($hex, 0, 1), 2));
            $g = hexdec(str_repeat(substr($hex, 1, 1), 2));
            $b = hexdec(str_repeat(substr($hex, 2, 1), 2));
            return new self($r, $g, $b);
        }
        return null;
    }

    public function asArray(): array
    {
        return ['r' => $this->r, 'g' => $this->g, 'b' => $this->b];
    }

    /** @return string Hex representation with hashtag like #ff00aa */
    public function asHex(): string
    {
        return sprintf("#%02x%02x%02x", $this->r, $this->g, $this->b);
    }
}