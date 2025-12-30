{
  description = "Code Crispies - Interactive CSS/HTML/Tailwind learning platform";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            gnumake
          ];

          shellHook = ''
            echo "Code Crispies Development Environment"
            echo ""
            echo "Commands:"
            echo "  make dev     - Start dev server (port 1234)"
            echo "  make build   - Production build"
            echo "  make test    - Run tests"
            echo "  make format  - Format code"
            echo ""
          '';
        };
      }
    );
}
