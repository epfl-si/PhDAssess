# This script aims to stay in the devenv 1.x family, as the 2.x need some work to be compatible
# with Meteor 3.x
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.devenv
  ];

  shellHook = ''
    echo "Force-use devenv version 1.x"
    devenv shell
  '';
}
