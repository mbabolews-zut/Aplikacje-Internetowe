<?php

namespace App\Model;

use App\Service\Config;
use App\DataTypes\ColorRGB;

class Color
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;
    private ?ColorRGB $rgb = null;

    /** @return array<string> List of validation error messages. Empty array if the object is valid. */
    public function validate(): array
    {
        $errors = [];
        // Validate name
        if ($this->getName() === null) {
            $errors[] = 'Name is required.';
            return $errors;
        }
        elseif (strlen($this->getName()) < 3) {
            $errors[] = 'Name must be at least 3 characters long.';
        }
        elseif (strlen($this->getName()) > 30) {
            $errors[] = 'Name must not exceed 30 characters.';
        }
        // Validate description
        if (!empty($this->getDescription())) {
            if (strlen($this->getDescription()) < 5) {
                $errors[] = 'Description must be empty or at least 5 characters long.';
            }
            elseif (strlen($this->getDescription()) > 255) {
                $errors[] = 'Description must not exceed 255 characters.';
            }
        } else {
            $this->setDescription(null);
        }
        // Validate RGB
        if ($this->getRgb() === null) {
            $errors[] = 'Empty or invalid RGB color.';
        }

        return $errors;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Color
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Color
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Color
    {
        $this->description = $description;

        return $this;
    }

    public function getRgb(): ?ColorRGB
    {
        return $this->rgb;
    }

    public function setRgb(?ColorRGB $rgb): void
    {
        $this->rgb = $rgb;
    }

    public static function fromArray($array): Color
    {
        $post = new self();
        $post->fill($array);

        return $post;
    }

    public function fill($array): Color
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['rgb'])) {
            $this->setRgb(ColorRGB::fromHex($array['rgb']));
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM color';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $colors = [];
        $colorsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($colorsArray as $colorArray) {
            $colors[] = self::fromArray($colorArray);
        }

        return $colors;
    }

    public static function find($id): ?Color
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM color WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$postArray) {
            return null;
        }
        $post = Color::fromArray($postArray);

        return $post;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO color (name, description, rgb) VALUES (:name, :description, :rgb)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'description' => $this->getDescription(),
                'rgb' => $this->getRgb()?->asHex(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE color SET name = :name, description = :description, rgb = :rgb WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':description' => $this->getDescription(),
                ':rgb' => $this->getRgb()?->asHex(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM color WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setDescription(null);
        $this->setRgb(null);
    }
}
