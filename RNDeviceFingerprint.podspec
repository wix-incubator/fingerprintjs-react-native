require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |spec|
  spec.name = 'RNDeviceFingerprint'
  spec.version = package['version']
  spec.summary = package['description']
  spec.description = package['description']
  spec.homepage = package['homepage']
  spec.license = package['license']
  spec.author = package['author']
  spec.source = {
    :git => 'https://github.com/wix-incubator/fingerprintjs-react-native.git',
    :tag => "v#{spec.version}"
  }

  spec.ios.deployment_target = '12.0'
  spec.swift_version = '5.7'
  spec.source_files = 'ios/**/*.{h,m,mm,swift}'
  spec.static_framework = true

  spec.dependency 'React-Core'
  spec.dependency 'FingerprintJS', '1.7.0'
end
